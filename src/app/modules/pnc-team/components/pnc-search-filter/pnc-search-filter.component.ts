import { GinqModel } from './../../../../core/models/ginq.model';
import { DivisionModel } from './../../../../core/models/division.model';
import { FormGroup, AbstractControl, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import $ from 'jquery';

import { Utils } from '../../../../shared/utils/utils';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { NavController, Events, Keyboard } from 'ionic-angular';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { Subject } from 'rxjs/Rx';
import { SessionService } from '../../../../core/services/session/session.service';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { AppConstant } from '../../../../app.constant';
import { PncFilterModel } from '../../../../core/models/pnc-filter.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { SpecialityEnum } from '../../../../core/enums/speciality.enum';
import { SectorModel } from '../../../../core/models/sector.model';

@Component({
  selector: 'pnc-search-filter',
  templateUrl: 'pnc-search-filter.component.html'
})
export class PncSearchFilterComponent implements OnInit {
  private static CDK_OVERLAY_0 = '#cdk-overlay-0';
  private static MAT_AUTOCOMPLETE_0 = '#mat-autocomplete-0';

  @Output() onSearch: EventEmitter<any> = new EventEmitter();

  @Output() pncSelected: EventEmitter<any> = new EventEmitter();

  defaultDivision: string;
  defaultSector: string;
  defaultGinq: string;
  defaultValue: boolean;
  valueAll = AppConstant.ALL;
  pncList: Observable<PncModel[]>;

  searchForm: FormGroup;
  autoCompleteForm: FormGroup;
  pncMatriculeControl: AbstractControl;
  selectedPnc: PncModel;
  searchTerms = new Subject<string>();

  // filtre de recherche
  pncFilter: PncFilterModel;
  // afficher/masquer le filtre
  showFilter = false;

  // Les listes des données du filtre
  divisionList: Array<DivisionModel>;
  sectorList: Array<SectorModel>;
  ginqList: Array<GinqModel>;
  relayList: string[];
  aircraftSkillList: string[];
  specialityList: string[];

  outOfDivision: boolean;

  // Définit la position top de la liste d'autocomplete
  autoCompleteTopPosition = -1;

  // Définit si une recherche d'autocomplete est en cours
  // Permet de gérer l'affichage du spinner de l'autocomplete
  autoCompleteRunning = false;

  constructor(private navCtrl: NavController,
    private sessionService: SessionService,
    private formBuilder: FormBuilder,
    private pncProvider: PncService,
    private connectivityService: ConnectivityService,
    private events: Events,
    private keyboard: Keyboard
  ) {
    this.connectivityService.connectionStatusChange.subscribe(connected => {
      this.initFilter();
    });

    this.events.subscribe('user:authenticationDone', () => {
      this.initFilter();
      this.initForm();
    });

    /**
     * Action lorsque le clavier s'affiche
     */
    this.keyboard.didShow.subscribe(() => {
      this.checkIfAutoCompleteIsOpen();
      if (this.autoCompleteTopPosition != -1) {
        $(PncSearchFilterComponent.CDK_OVERLAY_0).css('top', this.autoCompleteTopPosition + 'px');
      }
    });

    /**
     * Action lorsque le clavier disparaît
     */
    this.keyboard.didHide.subscribe(() => {
      const newHeight = window.innerHeight - this.autoCompleteTopPosition;
      $(PncSearchFilterComponent.CDK_OVERLAY_0).css('top', this.autoCompleteTopPosition + 'px');
      setTimeout(() => { $(PncSearchFilterComponent.MAT_AUTOCOMPLETE_0).css('max-height', newHeight + 'px'); }, 5000);
    });
  }

  /**
   * Vérifie toutes les 200ms que l'element d'autocomplete existe
   */
  checkIfAutoCompleteIsOpen() {
    setTimeout(() => {
      if ($(PncSearchFilterComponent.MAT_AUTOCOMPLETE_0).length != 0) {
        this.changeHeightOnOpen();
      } else {
        this.checkIfAutoCompleteIsOpen();
      }
    }, 200);
  }

  /**
   * Change la max-height de l'autocomplete en fonction de la taille de l'affichage disponible
   */
  changeHeightOnOpen() {
    this.autoCompleteTopPosition = this.autoCompleteTopPosition != -1 ? this.autoCompleteTopPosition : $(PncSearchFilterComponent.CDK_OVERLAY_0).offset().top;
    $(PncSearchFilterComponent.CDK_OVERLAY_0).css('top', this.autoCompleteTopPosition + 'px');
    $(PncSearchFilterComponent.MAT_AUTOCOMPLETE_0).css('max-height', window.innerHeight - this.autoCompleteTopPosition + 'px');
  }

  /**
   * Action déclenchée lors du click
   * @param evt event : click
   */
  search(): void {
    this.onSearch.next();
  }

  ngOnInit() {
    // initialistation du filtre
    this.initFilter();
    // Initialisation du formulaire
    this.initForm();
  }

  /**
   * Initialise le filtre, le nombre de pnc à afficher par page et les données des listes de recherche.
   */
  initFilter() {
    this.pncFilter = new PncFilterModel();
    this.showFilter = true;
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
        this.relayList = appInitData.relays;
        this.relayList.sort((value: string, otherValue: string) => {
          return value > otherValue ? 1 : -1;
        });
        this.aircraftSkillList = appInitData.aircraftSkills;
      }
      this.defaultDivision = appInitData.defaultDivision;
      this.defaultSector = appInitData.defaultSector;
      this.defaultGinq = appInitData.defaultGinq;
    }

  }

  /**
   * Réinitialise les valeurs des filtres de recherche
   */
  resetFilterValues() {
    this.selectedPnc = null;
    this.defaultValue = true;
    this.pncFilter.division = this.defaultDivision ? this.defaultDivision : AppConstant.ALL;
    this.divisionOnchanges();
    this.pncFilter.sector = this.defaultSector ? this.defaultSector : AppConstant.ALL;
    this.sectorOnchanges();
    this.pncFilter.ginq = this.defaultGinq ? this.defaultGinq : AppConstant.ALL;
    this.pncFilter.speciality = this.specialityList && this.specialityList.length === 1 ? this.specialityList[0] : AppConstant.ALL;
    this.pncFilter.aircraftSkill = this.aircraftSkillList && this.aircraftSkillList.length === 1 ? this.aircraftSkillList[0] : AppConstant.ALL;
    this.pncFilter.relay = this.relayList && this.relayList.length === 1 ? this.relayList[0] : AppConstant.ALL;
    this.searchForm.get('divisionControl').setValue(this.defaultDivision);
    this.searchForm.get('specialityControl').setValue(this.specialityList && this.specialityList.length === 1 ? this.specialityList[0] : AppConstant.ALL);
    this.searchForm.get('aircraftSkillControl').setValue(this.aircraftSkillList && this.aircraftSkillList.length === 1 ? this.aircraftSkillList[0] : AppConstant.ALL);
    this.searchForm.get('relayControl').setValue(this.relayList && this.relayList.length === 1 ? this.relayList[0] : AppConstant.ALL);
    this.autoCompleteForm.get('pncMatriculeControl').setValue('');
    this.autoCompleteRunning = false;
    this.searchForm.get('prioritizedControl').setValue(false);
    this.search();
    this.defaultValue = false;
  }

  /**
   * Initialise le formulaire
   */
  initForm() {
    this.searchForm = this.formBuilder.group({
      divisionControl: [this.pncFilter.division ? this.pncFilter.division : AppConstant.ALL],
      sectorControl: [this.pncFilter.sector ? this.pncFilter.sector : AppConstant.ALL],
      ginqControl: [this.pncFilter.ginq ? this.pncFilter.ginq : AppConstant.ALL],
      specialityControl: [this.pncFilter.speciality ? this.pncFilter.speciality : AppConstant.ALL],
      aircraftSkillControl: [this.pncFilter.aircraftSkill ? this.pncFilter.aircraftSkill : AppConstant.ALL],
      relayControl: [this.pncFilter.relay ? this.pncFilter.relay : AppConstant.ALL],
      prioritizedControl: [false]
    });
    this.autoCompleteForm = this.formBuilder.group({
      pncMatriculeControl: [
        '',
        Validators.compose([Validators.minLength(8), Validators.maxLength(8)])
      ]
    });
    if (this.connectivityService.isConnected()) {
      this.pncMatriculeControl = this.autoCompleteForm.get('pncMatriculeControl');
      this.initAutocompleteList();
      this.resetFilterValues();
      this.formOnChanges();
      this.pncMatriculeControl = this.autoCompleteForm.get('pncMatriculeControl');
    }
  }

  /**
    * recharge la liste des pnc de l'autocompletion aprés 500ms
    */
  initAutocompleteList() {
    this.pncList = this.searchTerms
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(
        term => this.getAutoCompleteDataReturn(term)
      )
      .catch(error => {
        this.autoCompleteRunning = false;
        return Observable.of<PncModel[]>([]);
      });
  }

  /**
   * Gére plus finement le retour de l'autocomplete
   * => Permet de gérer l'affichage du spinner et de forcer la position de l'autocompléte
   * @param term termes à rechercher pour l'autocomplete
   * @return Liste des pnc retrouvé par l'autocomplete
   */
  getAutoCompleteDataReturn(term: string): Observable<PncModel[]> {
    if (term) {
      return from(this.pncProvider.pncAutoComplete(term).then(
        data => {
          this.autoCompleteRunning = false;
          $(PncSearchFilterComponent.CDK_OVERLAY_0).css('top', this.autoCompleteTopPosition + 'px');
          return data;
        }));
    } else {
      this.autoCompleteRunning = false;
      return Observable.of<PncModel[]>([]);
    }
  }

  /**
   * Remplit le matricule du filtre avec le matricule du pnc selectionné.
   */
  prepareFilter(): void {
    if (this.selectedPnc) {
      this.pncFilter.pncMatricule = this.selectedPnc.matricule;
    }
  }

  /**
  * Affiche le PN dans l'autocomplete
  *  @param pn le PN sélectionné
  */
  displayPnc(pnc: PncModel) {
    return pnc
      ? pnc.firstName + ' ' + pnc.lastName + ' (' + pnc.matricule + ')'
      : pnc;
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
   * Ajoute un terme au flux
   * @param term le terme à ajouter
   */
  searchAutoComplete(term: string): void {
    this.checkIfAutoCompleteIsOpen();
    term = Utils.replaceSpecialCaracters(term);
    this.pncMatriculeControl.setValue(term);
    this.autoCompleteRunning = true;
    this.searchTerms.next(term);
  }

  /**
   * Fonction permettant de détecter et de gérer les changements de valeur des différents éléments du formulaire
   */
  formOnChanges() {
    this.searchForm.valueChanges.debounceTime(500).subscribe(val => {
      this.pncFilter.ginq = val.ginqControl;
      this.pncFilter.speciality = val.specialityControl;
      this.pncFilter.aircraftSkill = val.aircraftSkillControl;
      this.pncFilter.relay = val.relayControl;
      this.pncFilter.prioritized = val.prioritizedControl;
      this.search();
    });
  }

  /**
   * Active le rechargement des secteurs à chaque modification de division
   */
  divisionOnchanges() {
    this.searchForm.get('divisionControl').valueChanges.subscribe(val => {
      if (!this.defaultValue) {
        this.pncFilter.division = val;
      }
      this.getSectorList(this.pncFilter.division);
    });
  }

  /**
   * Active le rechargement des ginqs à chaque modification de secteur
   */
  sectorOnchanges() {
    this.searchForm.get('sectorControl').valueChanges.subscribe(val => {
      if (!this.defaultValue) {
        this.pncFilter.sector = val;
      }
      this.getGinqList(this.pncFilter.sector);
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
      this.pncFilter.sector = this.defaultSector;
      this.searchForm.get('sectorControl').setValue(this.defaultSector);
    } else {
      this.pncFilter.sector = AppConstant.ALL;
      this.searchForm.get('sectorControl').setValue(AppConstant.ALL);
    }
  }

  /**
   * Charge la liste des ginq associée au secteur choisi
   * @param sector le secteur choisi
   */
  getGinqList(sector: string) {
    this.ginqList = null;
    if (this.pncFilter.division !== AppConstant.ALL && sector !== '' && sector !== AppConstant.ALL) {
      this.ginqList = this.divisionList.find(divisionItem => divisionItem.code === this.pncFilter.division)
        .sectors
        .find(sectorItem => sectorItem.code === sector)
        .ginqs;
    }
    if (this.defaultValue && this.ginqList && this.defaultGinq && this.ginqList.find((ginq) => ginq.code === this.defaultGinq)) {
      this.pncFilter.ginq = this.defaultGinq;
      this.searchForm.get('ginqControl').setValue(this.defaultGinq);
    } else {
      this.pncFilter.ginq = AppConstant.ALL;
      this.searchForm.get('ginqControl').setValue(AppConstant.ALL);
    }
  }

  /**
   * Redirige vers la page d'accueil du pnc ou du cadre
   * @param pnc le pnc concerné
   */
  openPncHomePage(pnc: PncModel) {
    this.selectedPnc = undefined;
    this.initAutocompleteList();

    this.pncSelected.emit(pnc);
  }

  /**
  * Ouvre/ferme le filtre
  */
  toggleFilter() {
    this.showFilter = !this.showFilter;
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
}
