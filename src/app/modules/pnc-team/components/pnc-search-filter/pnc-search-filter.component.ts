import { PncFilterModel } from 'src/app/core/models/pnc-filter.model';
import { CareerObjectiveCategory } from 'src/app/core/models/career-objective-category';

import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Events, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AppConstant } from '../../../../app.constant';
import { PncSearchModeEnum } from '../../../../core/enums/pnc-search-mode.enum';
import { SpecialityEnum } from '../../../../core/enums/speciality.enum';
import { DivisionModel } from '../../../../core/models/division.model';
import { GinqModel } from '../../../../core/models/ginq.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { SectorModel } from '../../../../core/models/sector.model';
import { RelayModel } from '../../../../core/models/statutory-certificate/relay.model';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { SessionService } from '../../../../core/services/session/session.service';

@Component({
  selector: 'pnc-search-filter',
  templateUrl: 'pnc-search-filter.component.html',
  styleUrls: ['./pnc-search-filter.component.scss']
})
export class PncSearchFilterComponent implements AfterViewInit {

  @Input() filters: PncFilterModel;

  @Input() searchMode: PncSearchModeEnum;

  @Output() filtersChanged = new EventEmitter<PncFilterModel>();

  @Output() pncSelected: EventEmitter<any> = new EventEmitter();

  defaultDivision: string;
  defaultSector: string;
  defaultGinq: string;
  defaultValue: boolean;
  prioritized: boolean;
  priority: boolean;
  noPriority: boolean;

  searchForm: FormGroup;

  // Les listes des données du filtre
  divisionList: Array<DivisionModel>;
  sectorList: Array<SectorModel>;
  ginqList: Array<GinqModel>;
  relayList: Array<RelayModel>;
  aircraftSkillList: string[];
  specialityList: string[];
  priorityCategoryList: Array<CareerObjectiveCategory>;

  outOfDivision: boolean;
  priorityFilter;

  // Utilisé dans le template
  valueAll = AppConstant.ALL;

  constructor(
    private sessionService: SessionService,
    private connectivityService: ConnectivityService,
    private events: Events,
    public popoverCtrl: PopoverController,
    public translateService: TranslateService
  ) {
    this.connectivityService.connectionStatusChange.subscribe(connected => {
      this.initFilter();
      this.search();
      if (!connected) {
        this.searchForm.disable();
      } else {
        this.searchForm.enable();
      }
    });

    this.events.subscribe('user:authenticationDone', () => {
      this.initFilter();
      this.initForm();
    });

  }

  /**
   * Déclenche une recherche (quand l'utilisateur clique sur le bouton rechercher)
   */
  search(): void {
    this.filtersChanged.next();
  }

  ngAfterViewInit() {
    // initialistation du filtre
    this.initFilter();
    // Initialisation du formulaire
    this.initForm();
  }

  /**
   * Initialise le filtre et les données des listes de recherche.
   */
  initFilter() {
    this.specialityList = Object.keys(SpecialityEnum)
      .map(k => SpecialityEnum[k])
      .filter(v => typeof v === 'string') as string[];
    if (this.sessionService.getActiveUser().appInitData !== undefined) {
      const appInitData = this.sessionService.getActiveUser().appInitData;
      this.divisionList = appInitData.divisionSectorGinqTree;
      if (this.divisionList.length === 0) {
        this.outOfDivision = true;
      } else {
        this.outOfDivision = false;
        // tslint:disable-next-line: no-misleading-array-reverse
        this.relayList = appInitData.relays.sort((relay1, relay2) => {
          return relay1.code > relay2.code ? 1 : -1;
        });
        this.aircraftSkillList = appInitData.aircraftSkills;
        this.priorityCategoryList = appInitData.careerObjectiveCategories;
      }
      if (this.isAlternantSearch()) {
        this.defaultDivision = AppConstant.ALL;
        this.defaultSector = AppConstant.ALL;
        this.defaultGinq = AppConstant.ALL;
      } else {
        this.defaultDivision = appInitData.defaultDivision;
        this.defaultSector = appInitData.defaultSector;
        this.defaultGinq = appInitData.defaultGinq;
      }
    }

  }

  /**
   * Réinitialise les valeurs des filtres de recherche
   */
  resetFilterValues() {
    this.defaultValue = true;
    this.filters.division = this.defaultDivision ? this.defaultDivision : AppConstant.ALL;
    this.divisionOnchanges();
    this.filters.sector = this.defaultSector ? this.defaultSector : AppConstant.ALL;
    this.sectorOnchanges();
    this.filters.ginq = this.defaultGinq ? this.defaultGinq : AppConstant.ALL;
    if (this.isAlternantSearch()) {
      this.filters.speciality = SpecialityEnum.ALT;
      this.searchForm.get('specialityControl').setValue(SpecialityEnum.ALT);
    } else {
      this.filters.speciality = this.specialityList && this.specialityList.length === 1 ? this.specialityList[0] : AppConstant.ALL;
      this.searchForm.get('specialityControl').setValue(this.specialityList && this.specialityList.length === 1 ? this.specialityList[0] : AppConstant.ALL);
    }
    this.filters.aircraftSkill = this.aircraftSkillList && this.aircraftSkillList.length === 1 ? this.aircraftSkillList[0] : AppConstant.ALL;
    this.filters.relay = this.relayList && this.relayList.length === 1 ? this.relayList[0].code : AppConstant.ALL;
    this.filters.priorityCategoryCode = this.priorityCategoryList && this.priorityCategoryList.length === 1 ? this.priorityCategoryList[0].code : AppConstant.ALL;
    this.filters.prioritized = false;
    this.filters.hasAtLeastOnePriorityInProgress = false;
    this.filters.hasNoPriority = false;
    this.filters.taf = false;
    this.filters.hasManifex = false;
    this.searchForm.get('divisionControl').setValue(this.defaultDivision);
    this.searchForm.get('aircraftSkillControl').setValue(this.aircraftSkillList && this.aircraftSkillList.length === 1 ? this.aircraftSkillList[0] : AppConstant.ALL);
    this.searchForm.get('relayControl').setValue(this.relayList && this.relayList.length === 1 ? this.relayList[0] : AppConstant.ALL);
    this.searchForm.get('priorityCategoryControl').setValue(this.priorityCategoryList && this.priorityCategoryList.length === 1 ? this.priorityCategoryList[0] : AppConstant.ALL);
    this.searchForm.get('prioritizedControl').setValue(false);
    this.searchForm.get('hasAtLeastOnePriorityInProgressControl').setValue(false);
    this.searchForm.get('hasNoPriorityControl').setValue(false);
    this.searchForm.get('hasDefaultHiddenEventsControl').setValue(false);
    this.searchForm.get('hasHiddenEventsControl').setValue(false);
    this.searchForm.get('tafControl').setValue(false);
    this.searchForm.get('hasManifexControl').setValue(false);
    this.defaultValue = false;
    this.priority = false;
    this.noPriority = false;
    this.prioritized = false;
  }

  /**
   * Initialise le formulaire
   */
  initForm() {
    const specialityInitValue = this.isAlternantSearch() ?
      SpecialityEnum.ALT
      : (this.filters.speciality ? this.filters.speciality : AppConstant.ALL);

    this.searchForm = new FormGroup({
      divisionControl: new FormControl({
        value: [this.filters.division ? this.filters.division : AppConstant.ALL],
        disabled: this.areFiltersDisabled()
      }),
      sectorControl: new FormControl({
        value: [this.filters.sector ? this.filters.sector : AppConstant.ALL],
        disabled: this.areFiltersDisabled()
      }),
      ginqControl: new FormControl({
        value: [this.filters.ginq ? this.filters.ginq : AppConstant.ALL],
        disabled: this.areFiltersDisabled()
      }),
      specialityControl: new FormControl({
        value: [specialityInitValue],
        disabled: this.areFiltersDisabled()
      }),
      aircraftSkillControl: new FormControl({
        value: [this.filters.aircraftSkill ? this.filters.aircraftSkill : AppConstant.ALL],
        disabled: this.areFiltersDisabled()
      }),
      relayControl: new FormControl({
        value: [this.filters.relay ? this.filters.relay : AppConstant.ALL],
        disabled: this.areFiltersDisabled()
      }),
      priorityCategoryControl: new FormControl({
        value: [this.filters ? this.filters.priorityCategoryCode : AppConstant.ALL],
        disabled: this.areFiltersDisabled()
      }),
      prioritizedControl: new FormControl({
        value: [false],
        disabled: this.noPriority || this.areFiltersDisabled()
      }),
      hasAtLeastOnePriorityInProgressControl: new FormControl({
        value: [false],
        disabled: this.noPriority || this.areFiltersDisabled()
      }),
      hasNoPriorityControl: new FormControl({
        value: [false],
        disabled: this.prioritized || this.noPriority || this.areFiltersDisabled()
      }),
      hasDefaultHiddenEventsControl: new FormControl({
        value: [false],
        disabled: this.areFiltersDisabled()
      }),
      hasHiddenEventsControl: new FormControl({
        value: [false],
        disabled: this.areFiltersDisabled()
      }),
      tafControl: new FormControl({
        value: [false],
        disabled: this.areFiltersDisabled()
      }),
      hasManifexControl: new FormControl({
        value: [false],
        disabled: this.areFiltersDisabled()
      }),
    });
    if (this.connectivityService.isConnected()) {
      this.resetFilterValues();
      this.formOnChanges();
      this.search();
    }
  }

  /**
   *  deux valeurs et renvois true si elles sont égales
   * @param e1 premiere valeur à comparér
   * @param e2 Deuxieme valeur à comparér
   */
  compareFn(e1: string, e2: string): boolean {
    if (e1 === e2) {
      return true;
    }
    return false;
  }

  /**
   * Fonction permettant de détecter et de gérer les changements de valeur des différents éléments du formulaire
   */
  formOnChanges() {
    this.searchForm.valueChanges.subscribe(val => {
      this.filters.ginq = val.ginqControl;
      this.filters.speciality = val.specialityControl;
      this.filters.aircraftSkill = val.aircraftSkillControl;
      this.filters.relay = val.relayControl;
      this.filters.priorityCategoryCode = val.priorityCategoryControl;
      this.filters.prioritized = val.prioritizedControl;
      this.filters.hasAtLeastOnePriorityInProgress = val.hasAtLeastOnePriorityInProgressControl;
      this.filters.hasNoPriority = val.hasNoPriorityControl;
      this.filters.hasDefaultHiddenEvents = val.hasDefaultHiddenEventsControl;
      this.filters.hasHiddenEvents = val.hasHiddenEventsControl;
      this.filters.taf = val.tafControl;
      this.filters.hasManifex = val.hasManifexControl;
    });
  }

  /**
   * Active le rechargement des secteurs à chaque modification de division
   */
  divisionOnchanges() {
    this.searchForm.get('divisionControl').valueChanges.subscribe(val => {
      if (!this.defaultValue) {
        this.filters.division = val;
      }
      this.getSectorList(this.filters.division);
    });
  }

  /**
   * Active le rechargement des ginqs à chaque modification de secteur
   */
  sectorOnchanges() {
    this.searchForm.get('sectorControl').valueChanges.subscribe(val => {
      if (!this.defaultValue) {
        this.filters.sector = val;
      }
      this.getGinqList(this.filters.sector);
    });
  }

  /**
   * Charge la liste des secteurs associée à la division choisie
   * @param division la division choisie
   */
  getSectorList(division: string) {
    this.ginqList = null;
    this.sectorList = null;
    if (division !== AppConstant.ALL) {
      this.sectorList = this.divisionList.find(divisionItem => divisionItem.code === division).sectors;
    }
    if (this.defaultValue && this.sectorList && this.defaultSector && this.sectorList.find((sector) => sector.code === this.defaultSector)) {
      this.filters.sector = this.defaultSector;
      this.searchForm.get('sectorControl').setValue(this.defaultSector);
    } else {
      this.filters.sector = AppConstant.ALL;
      this.searchForm.get('sectorControl').setValue(AppConstant.ALL);
    }
  }

  /**
   * Charge la liste des ginq associée au secteur choisi
   * @param sector le secteur choisi
   */
  getGinqList(sector: string) {
    this.ginqList = null;
    if (this.filters.division !== AppConstant.ALL && sector !== '' && sector !== AppConstant.ALL) {
      this.ginqList = this.divisionList.find(divisionItem => divisionItem.code === this.filters.division)
        .sectors
        .find(sectorItem => sectorItem.code === sector)
        .ginqs;
    }
    if (this.defaultValue && this.ginqList && this.defaultGinq && this.ginqList.find((ginq) => ginq.code === this.defaultGinq)) {
      this.filters.ginq = this.defaultGinq;
      this.searchForm.get('ginqControl').setValue(this.defaultGinq);
    } else {
      this.filters.ginq = AppConstant.ALL;
      this.searchForm.get('ginqControl').setValue(AppConstant.ALL);
    }
  }

  /**
   * Redirige vers la page d'accueil du pnc ou du cadre
   * @param pnc le pnc concerné
   */
  openPncHomePage(pnc: PncModel) {
    this.pncSelected.emit(pnc);
  }

  areFiltersDisabled(): boolean {
    return !this.connectivityService.isConnected();
  }

  clearButtonIsDisabled(): boolean {
    return this.outOfDivision || this.areFiltersDisabled();
  }

  inactiveFiltersLabelClass(): string {
    return this.connectivityService.isConnected() ? 'hide-label' : 'show-label';
  }

  /**
   * Vérifie si on est sur la recherche d'alternant
   * @return vrai si on est sur la recherche d'alternant, faux sinon
   */
  isAlternantSearch() {
    return this.searchMode === PncSearchModeEnum.ALTERNANT;
  }
}