import { CareerObjectiveCategory } from 'src/app/core/models/career-objective-category';
import { PncFilterModel } from 'src/app/core/models/pnc-filter.model';

import {
    AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material';
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
import { FormsUtil } from '../../../../shared/utils/forms-util';

@Component({
  selector: 'pnc-search-filter',
  templateUrl: 'pnc-search-filter.component.html',
  styleUrls: ['./pnc-search-filter.component.scss']
})
export class PncSearchFilterComponent implements AfterViewInit {

  @Input() searchMode: PncSearchModeEnum;

  @Output() searchLaunched = new EventEmitter<PncFilterModel>();
  @Output() searchReinitialized = new EventEmitter<PncFilterModel>();
  @Output() pncSelected: EventEmitter<any> = new EventEmitter();
  @Output() enabledFiltersCountChanged: EventEmitter<number> = new EventEmitter();

  filters = new PncFilterModel();

  defaultDivision: string;
  defaultSector: string;
  defaultGinq: string;

  searchForm: FormGroup;

  // Les listes des données du filtre
  divisionList: Array<DivisionModel>;
  sectorList: Array<SectorModel>;
  ginqList: Array<GinqModel>;
  relayList: Array<RelayModel>;
  aircraftSkillList: string[];
  specialityList: string[];
  workRateList: number[];
  careerObjectiveCategoryList: Array<CareerObjectiveCategory>;

  // Utilisé dans le template
  valueAll = AppConstant.ALL;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private sessionService: SessionService,
    public connectivityService: ConnectivityService,
    private events: Events,
    public popoverCtrl: PopoverController,
    public translateService: TranslateService,
  ) {
    this.connectivityService.connectionStatusChange.subscribe(connected => {
      this.buildFilterValueLists();
      this.search();
      if (!connected) {
        this.searchForm.disable();
      } else {
        this.searchForm.enable();
      }
    });

    this.events.subscribe('user:authenticationDone', () => {
      this.buildFilterValueLists();
      this.reinitializeSearch();
    });
  }

  ngAfterViewInit() {
    this.buildFilterValueLists();
    // Initialisation du formulaire
    this.initForm();
    this.formOnChanges();
    this.divisionOnchanges();
    this.sectorOnchanges();
    this.reinitializeSearch();
    this.countEnabledFilters();
  }

  /**
   * Déclenche une recherche (quand l'utilisateur clique sur le bouton rechercher)
   */
  search(): void {
    FormsUtil.extractFormValues(this.filters, this.searchForm);
    this.searchLaunched.next(this.filters);
  }

  /**
   * Réinitialise les valeurs des filtres de recherche et déclenche une recherche
   */
  reinitializeSearch() {
    this.searchForm.reset(this.getFormInitValues());
    FormsUtil.extractFormValues(this.filters, this.searchForm);
    this.searchReinitialized.emit(this.filters);
  }

  /**
   * Initialise le filtre et les données des listes de recherche.
   */
  buildFilterValueLists() {
    this.specialityList = Object.keys(SpecialityEnum)
      .map(k => SpecialityEnum[k])
      .filter(v => typeof v === 'string') as string[];
    if (this.sessionService.getActiveUser().appInitData !== undefined) {
      const appInitData = this.sessionService.getActiveUser().appInitData;
      this.divisionList = appInitData.divisionSectorGinqTree;
      this.workRateList = appInitData.workRates;
      this.relayList = appInitData.relays.sort((relay1, relay2) => {
        return relay1.code > relay2.code ? 1 : -1;
      });
      this.aircraftSkillList = appInitData.aircraftSkills;
      this.careerObjectiveCategoryList = appInitData.careerObjectiveCategories;
      if (this.isAlternantSearch()) {
        this.defaultDivision = this.valueAll;
        this.defaultSector = this.valueAll;
        this.defaultGinq = this.valueAll;
      } else {
        this.defaultDivision = appInitData.defaultDivision;
        this.defaultSector = appInitData.defaultSector;
        this.defaultGinq = appInitData.defaultGinq;
      }
    }
  }

  /**
   * Initialise le formulaire
   */
  initForm() {
    this.searchForm = new FormGroup({
      division: new FormControl(),
      sector: new FormControl(),
      ginq: new FormControl(),
      speciality: new FormControl(),
      workRate: new FormControl(),
      aircraftSkill: new FormControl(),
      relay: new FormControl(),
      careerObjectiveCategory: new FormControl(),
      prioritized: new FormControl(),
      hasAtLeastOneCareerObjectiveInProgress: new FormControl(),
      hasNoCareerObjective: new FormControl(),
      hasDefaultHiddenEvents: new FormControl(),
      hasHiddenEvents: new FormControl(),
      hasEObsOlderThan18Months: new FormControl(),
      hasNoEObs: new FormControl(),
      hasProfessionalInterviewOlderThan24Months: new FormControl(),
      hasNoProfessionalInterview: new FormControl(),
      taf: new FormControl(),
      hasManifex: new FormControl()
    });
  }

  /**
   * Récupère les valeurs initiales des filtres
   * @return un objet mappant le champs et sa valeur d'initialisation
   */
  getFormInitValues(): any {
    return {
      division: this.defaultDivision ? this.defaultDivision : this.valueAll,
      sector: this.defaultSector ? this.defaultSector : this.valueAll,
      ginq: this.defaultGinq ? this.defaultGinq : this.valueAll,
      speciality: this.isAlternantSearch() ?
        SpecialityEnum.ALT
        : this.specialityList && this.specialityList.length === 1 ? this.specialityList[0] : this.valueAll,
      workRate: this.workRateList && this.workRateList.length === 1 ? this.workRateList[0] : this.valueAll,
      aircraftSkill: this.aircraftSkillList && this.aircraftSkillList.length === 1 ?
        this.aircraftSkillList[0] : this.valueAll
      ,
      relay: this.relayList && this.relayList.length === 1 ? this.relayList[0].code : this.valueAll,
      careerObjectiveCategory: this.careerObjectiveCategoryList && this.careerObjectiveCategoryList.length === 1 ?
        this.careerObjectiveCategoryList[0].code : this.valueAll
      ,
      prioritized: false,
      hasAtLeastOneCareerObjectiveInProgress: false,
      hasNoCareerObjective: false,
      hasDefaultHiddenEvents: false,
      hasHiddenEvents: false,
      hasEObsOlderThan18Months: false,
      hasNoEObs: false,
      hasProfessionalInterviewOlderThan24Months: false,
      hasNoProfessionalInterview: false,
      taf: false,
      hasManifex: false
    };
  }

  /**
   * Fonction permettant de détecter et de gérer les changements de valeur des différents éléments du formulaire
   */
  formOnChanges() {
    this.searchForm.valueChanges.subscribe((value) => {
      this.countEnabledFilters();

      // Gestion de l'exclusivité des filtres
      value.hasEObsOlderThan18Months ?
        this.searchForm.get('hasNoEObs').disable({ emitEvent: false }) :
        this.searchForm.get('hasNoEObs').enable({ emitEvent: false });

      value.hasNoEObs ?
        this.searchForm.get('hasEObsOlderThan18Months').disable({ emitEvent: false }) :
        this.searchForm.get('hasEObsOlderThan18Months').enable({ emitEvent: false });

      value.hasProfessionalInterviewOlderThan24Months ?
        this.searchForm.get('hasNoProfessionalInterview').disable({ emitEvent: false }) :
        this.searchForm.get('hasNoProfessionalInterview').enable({ emitEvent: false });

      value.hasNoProfessionalInterview ?
        this.searchForm.get('hasProfessionalInterviewOlderThan24Months').disable({ emitEvent: false }) :
        this.searchForm.get('hasProfessionalInterviewOlderThan24Months').enable({ emitEvent: false });

      value.prioritized || value.hasAtLeastOneCareerObjectiveInProgress ?
        this.searchForm.get('hasNoCareerObjective').disable({ emitEvent: false }) :
        this.searchForm.get('hasNoCareerObjective').enable({ emitEvent: false });

      if (value.hasNoCareerObjective) {
        this.searchForm.get('prioritized').disable({ emitEvent: false });
        this.searchForm.get('hasAtLeastOneCareerObjectiveInProgress').disable({ emitEvent: false });
      } else {
        this.searchForm.get('prioritized').enable({ emitEvent: false });
        this.searchForm.get('hasAtLeastOneCareerObjectiveInProgress').enable({ emitEvent: false });
      }
    });
  }

  /**
   * Compte le nombre de filtres activés
   */
  private countEnabledFilters() {
    const enabledFiltersCount = Object.values(this.searchForm.value)
      .filter((value: string | boolean) => value && (value !== this.valueAll)).length;
    this.enabledFiltersCountChanged.emit(enabledFiltersCount);
  }

  /**
   * Active le rechargement des secteurs à chaque modification de division
   */
  divisionOnchanges() {
    this.searchForm.get('division').valueChanges.subscribe((division) => {
      this.getSectorList(division);
    });
  }

  /**
   * Active le rechargement des ginqs à chaque modification de secteur
   */
  sectorOnchanges() {
    this.searchForm.get('sector').valueChanges.subscribe((sector) => {
      this.getGinqList(sector);
    });
  }

  /**
   * Charge la liste des secteurs associée à la division choisie
   * @param division la division choisie
   */
  getSectorList(division: string) {
    this.ginqList = null;
    this.sectorList = null;
    if (division !== this.valueAll) {
      this.sectorList = this.divisionList.find(divisionItem => divisionItem.code === division).sectors;
    }
    if (this.sectorList && this.defaultSector && this.sectorList.find((sector) => sector.code === this.defaultSector)) {
      this.searchForm.get('sector').setValue(this.defaultSector);
      this.changeDetectorRef.detectChanges();
    } else {
      this.searchForm.get('sector').setValue(this.valueAll);
    }
  }

  /**
   * Charge la liste des ginq associée au secteur choisi
   * @param sector le secteur choisi
   */
  getGinqList(sector: string) {
    this.ginqList = null;
    if (this.searchForm.get('division').value !== this.valueAll && sector !== '' && sector !== this.valueAll) {
      this.ginqList = this.divisionList.find(divisionItem => divisionItem.code === this.searchForm.get('division').value)
        .sectors
        .find(sectorItem => sectorItem.code === sector)
        .ginqs;
    }
    if (this.ginqList && this.defaultGinq && this.ginqList.find((ginq) => ginq.code === this.defaultGinq)) {
      this.searchForm.get('ginq').setValue(this.defaultGinq);
      this.changeDetectorRef.detectChanges();
    } else {
      this.searchForm.get('ginq').setValue(this.valueAll);
    }
  }
  /**
   * Retourne le label de la division à afficher dans la picklist
   * @param division la division dont on souhaite déterminer le label
   * @return le label à affiché
   */
  getDivisionLabel(division: DivisionModel): string {
    return (division.longCode && division.longCode.length > 0) ? division.longCode : division.code;
  }

  /**
   * Redirige vers la page d'accueil du pnc ou du cadre
   * @param pnc le pnc concerné
   */
  openPncHomePage(pnc: PncModel) {
    this.pncSelected.emit(pnc);
  }

  /**
   * Vérifie si on est sur la recherche d'alternant
   * @return vrai si on est sur la recherche d'alternant, faux sinon
   */
  isAlternantSearch() {
    return this.searchMode === PncSearchModeEnum.ALTERNANT;
  }

  /**
   * Permet de scroller jusqu'a la fin du panel ouvert.
   * @param panel le panel conçeré
   */
  scrollTo(panel: MatExpansionPanel) {
    panel._body.nativeElement
      .scrollIntoView({ behavior: 'smooth' });
  }

}
