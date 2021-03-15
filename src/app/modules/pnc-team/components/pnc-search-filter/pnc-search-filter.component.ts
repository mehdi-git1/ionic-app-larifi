import * as _ from 'lodash-es';
import { CareerObjectiveCategory } from 'src/app/core/models/career-objective-category';
import { PncFilterModel } from 'src/app/core/models/pnc-filter.model';
import { Utils } from 'src/app/shared/utils/utils';

import {
    AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { PopoverController } from '@ionic/angular';
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
import { Events } from '../../../../core/services/events/events.service';
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
    this.initDefautlValue();
    this.formOnChanges();
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
      divisions: new FormControl(['']),
      sectors: new FormControl(['']),
      ginqs: new FormControl(['']),
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
      divisions: this.defaultDivision ? [this.defaultDivision] : [this.valueAll],
      sectors: this.defaultSector ? [this.defaultSector] : [this.valueAll],
      ginqs: this.defaultGinq ? [this.defaultGinq] : [this.valueAll],
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
   * Remplie les valeurs par défaut de la section affectation du formulaire
   */
  initDefautlValue(): void {
    this.updateSectorSelectList([this.defaultDivision]);
    this.updateGinqSelectList([this.defaultSector]);
  }

  /**
   * Sélectionne/déselectionne toutes les divisions
   */
  toggleAllDivisions() {
    if (this.searchForm.get('divisions').value.find(division => division === this.valueAll)) {
      this.searchForm.get('divisions').setValue([...this.divisionList.map(division => division.code), this.valueAll]);
    } else {
      this.searchForm.get('divisions').setValue([]);
    }
    this.updateSectorSelectList(this.searchForm.get('divisions').value);
  }

  /**
   * Déselectionne l'option "toutes" des divisions
   */
  unselectDivisionAllOption() {
    const selectedDivisions = _.cloneDeep(this.searchForm.get('divisions').value);
    this.searchForm.get('divisions').setValue(Utils.arrayRemoveValue(selectedDivisions, this.valueAll));
  }

  /**
   * charge les secteurs en fonction des divisions sélectionnées
   * @param divisionList les divisions sélectionnées
   */
  updateSectorSelectList(divisionList: Array<string>) {
    // Si aucune division n'est sélectionnée, on propose quand même tous les secteurs
    let divisions = _.cloneDeep(divisionList);
    if (divisionList.length === 0) {
      divisions = this.divisionList.map(division => division.code);
    }
    this.sectorList = this.divisionList
      .filter(divisionItem =>
        divisions.some(selectedDivision => selectedDivision === divisionItem.code))
      .map(divisionItem => divisionItem.sectors)
      .reduce((acc, sector) => acc.concat(sector), []);

    this.searchForm.get('sectors').setValue([]);

    this.updateGinqSelectList(this.searchForm.get('sectors').value);
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Sélectionne/déselectionne tous les secteurs
   */
  toggleAllSectors() {
    if (this.searchForm.get('sectors').value.find(sector => sector === this.valueAll)) {
      this.searchForm.get('sectors').setValue([...this.sectorList.map(sector => sector.code), this.valueAll]);
    } else {
      this.searchForm.get('sectors').setValue([]);
    }
    this.updateGinqSelectList(this.searchForm.get('sectors').value);
  }

  /**
   * Déselectionne l'option "tous" des secteurs
   */
  unselectSectorAllOption() {
    const selectedSectors = _.cloneDeep(this.searchForm.get('sectors').value);
    this.searchForm.get('sectors').setValue(Utils.arrayRemoveValue(selectedSectors, this.valueAll));
  }

  /**
   * Charge les ginqs en fonction des secteurs sélectionnés
   * @param sectorList  les secteurs sélectionnés
   */
  updateGinqSelectList(sectorList: string[]): void {
    // Si aucun secteur n'est sélectionnée, on propose quand même tous les ginqs
    let sectors = _.cloneDeep(sectorList);
    if (sectors.length === 0) {
      sectors = this.sectorList.map(sector => sector.code);
    }
    this.ginqList = this.sectorList
      .filter(sector =>
        sectors.some(selectedSectorCode => selectedSectorCode === sector.code)
      )
      .map(sector => sector.ginqs)
      .reduce((acc, ginqs) => acc.concat(ginqs), []);

    this.searchForm.get('ginqs').setValue([]);
  }

  /**
   * Sélectionne/déselectionne tous les ginqs
   */
  toggleAllGinqs() {
    if (this.searchForm.get('ginqs').value.find(ginq => ginq === this.valueAll)) {
      this.searchForm.get('ginqs').setValue([...this.ginqList.map(ginq => ginq.code), this.valueAll]);
    } else {
      this.searchForm.get('ginqs').setValue([]);
    }
  }
  /**
   * Retourne le label de la division à afficher dans la picklist
   * @param division la division dont on souhaite déterminer le label
   * @return le label à afficher
   */
  getDivisionLabel(division: DivisionModel): string {
    return (division.longCode && division.longCode.length > 0) ? division.longCode : division.code;
  }

  /**
   * Déselectionne l'option "toutes" des ginqs
   */
  unselectGinqAllOption() {
    const selectedGinqs = _.cloneDeep(this.searchForm.get('ginqs').value);
    this.searchForm.get('ginqs').setValue(Utils.arrayRemoveValue(selectedGinqs, this.valueAll));
  }

  /**
   * Récupère les codes secteur à afficher dans la liste de sélection en supprimant les doublons
   * @return la liste des codes secteurs sans doublons
   */
  getUniqueSectorList(): Set<string> {
    return this.sectorList ? new Set(this.sectorList.map(sector => sector.code).sort()) : new Set();
  }

  /**
   * Récupère les codes Ginq à afficher dans la liste de sélection en supprimant les doublons
   *
   * @return la liste des ginqs sans doublons
   */
  getUniqueGinqList(): Set<string> {
    return this.ginqList ? new Set(this.ginqList.map(ginq => ginq.code).sort()) : new Set();
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
   * Permet de scroller jusqu'a la fin du panel ouvert
   * @param panel le panel concerné
   */
  scrollTo(panel: MatExpansionPanel) {
    panel._body.nativeElement
      .scrollIntoView({ behavior: 'smooth' });
  }

}
