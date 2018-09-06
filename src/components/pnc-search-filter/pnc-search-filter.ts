import { ConnectivityService } from './../../services/connectivity.service';
import { NavController, Events, Keyboard } from 'ionic-angular';
import { PncProvider } from './../../providers/pnc/pnc';
import { Subject } from 'rxjs/Rx';
import { SessionService } from './../../services/session.service';
import { PncHomePage } from './../../pages/pnc-home/pnc-home';
import { Observable } from 'rxjs/Observable';
import { Speciality } from './../../models/speciality';
import { AppConstant } from './../../app/app.constant';
import { PncFilter } from './../../models/pncFilter';
import { Pnc } from './../../models/pnc';
import { FormGroup, AbstractControl, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import $ from 'jquery';

@Component({
  selector: 'pnc-search-filter',
  templateUrl: 'pnc-search-filter.html'
})
export class PncSearchFilterComponent implements OnInit {

  @Output() onSearch: EventEmitter<any> = new EventEmitter();

  valueAll = AppConstant.ALL;
  pncList: Observable<Pnc[]>;

  searchForm: FormGroup;
  autoCompleteForm: FormGroup;
  pncMatriculeControl: AbstractControl;
  selectedPnc: Pnc;
  searchTerms = new Subject<string>();

  // filtre de recherche
  pncFilter: PncFilter;
  // afficher/masquer le filtre
  showFilter: Boolean = false;

  // Les listes des données du filtre
  divisionList: string[];
  sectorList: string[];
  ginqList: string[];
  relayList: string[];
  aircraftSkillList: string[];
  specialityList: string[];

  outOfDivision: boolean;

  searchNeedToBeRefreshed: boolean;

  autoCompleteTopPosition = -1;

  constructor(private navCtrl: NavController,
    private sessionService: SessionService,
    private formBuilder: FormBuilder,
    private pncProvider: PncProvider,
    private connectivityService: ConnectivityService,
    private events: Events,
    private keyboard: Keyboard) {
    this.searchNeedToBeRefreshed = false;
    this.connectivityService.connectionStatusChange.subscribe(connected => {
      this.searchNeedToBeRefreshed = true;
    });

    this.events.subscribe('parameters:ready', () => {
      this.initFilter();
    });

    this.checkIfMaterialOpen();

    /**
     * Action lorsque le clavier s'affiche
     */
    this.keyboard.didShow.subscribe(() => {
      this.checkIfMaterialOpen();
      if (this.autoCompleteTopPosition != -1){
        $('#cdk-overlay-0').css('top', this.autoCompleteTopPosition + 'px' );
      }
    });

    /**
     * Action lorsque le clavier disparaît
     */
    this.keyboard.didHide.subscribe(() => {
      const newHeight = window.innerHeight - this.autoCompleteTopPosition;
      $('#mat-autocomplete-0').css('max-height', newHeight + 'px' );
    });
  }

  /**
   * Vérifie toutes les 100ms que l'element d'autocomplete existe
   */
  checkIfMaterialOpen(){
    window.setTimeout(() => {
      if ($('#mat-autocomplete-0').length != 0){
        this.changeHeightOnOpened();
      }else{
        this.checkIfMaterialOpen();
      }
    }, 200);
  }

  /**
   * Change la max-height de l'autocomplete en fonction de la taille de l'affichage disponible
   */
  changeHeightOnOpened(){
    this.autoCompleteTopPosition = this.autoCompleteTopPosition != -1 ? this.autoCompleteTopPosition : $('#cdk-overlay-0').offset().top;
    $('#mat-autocomplete-0').css('max-height', window.innerHeight - this.autoCompleteTopPosition + 'px' );
  }

  /**
   * Action déclenchée lors du click
   * @param evt event : click
   */
  search(): void {
    this.onSearch.next();
  }

  /**
   * Action déclenchée lors du click
   * @param evt event : click
   */
  refreshSearch(): void {
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
    this.pncFilter = new PncFilter();
    this.showFilter = true;
    this.specialityList = Object.keys(Speciality)
      .map(k => Speciality[k])
      .filter(v => typeof v === 'string') as string[];
    if (this.sessionService.parameters !== undefined) {
      const params: Map<string, any> = this.sessionService.parameters.params;
      this.divisionList = Object.keys(params['divisions']);
      if (this.divisionList.length === 0) {
        this.outOfDivision = true;
      } else {
        this.outOfDivision = false;
        this.relayList = params['relays'];
        this.aircraftSkillList = params['aircraftSkills'];
      }
    }

    this.pncFilter.division = AppConstant.ALL;
    this.pncFilter.sector = AppConstant.ALL;
    this.pncFilter.ginq = AppConstant.ALL;
    this.pncFilter.speciality = AppConstant.ALL;
    this.pncFilter.aircraftSkill = AppConstant.ALL;
    this.pncFilter.relay = AppConstant.ALL;

  }

  /**
   * Réinitialise les valeurs des filtres de recherche
   */
  resetFilterValues() {
    this.searchForm.get('divisionControl').setValue(AppConstant.ALL);
    this.searchForm.get('sectorControl').setValue(AppConstant.ALL);
    this.searchForm.get('ginqControl').setValue(AppConstant.ALL);
    this.searchForm.get('specialityControl').setValue(AppConstant.ALL);
    this.searchForm.get('aircraftSkillControl').setValue(AppConstant.ALL);
    this.searchForm.get('relayControl').setValue(AppConstant.ALL);
    this.autoCompleteForm.get('pncMatriculeControl').setValue('');
  }

  /**
   * Initialise le formulaire
   */
  initForm() {
    this.searchForm = this.formBuilder.group({
      divisionControl: [this.pncFilter.division],
      sectorControl: [this.pncFilter.sector],
      ginqControl: [this.pncFilter.ginq],
      specialityControl: [this.pncFilter.speciality],
      aircraftSkillControl: [this.pncFilter.aircraftSkill],
      relayControl: [this.pncFilter.relay],
    });
    this.autoCompleteForm = this.formBuilder.group({
      pncMatriculeControl: [
        '',
        Validators.compose([Validators.minLength(8), Validators.maxLength(8)])
      ]
    });
    this.pncMatriculeControl = this.autoCompleteForm.get('pncMatriculeControl');

    this.initAutocompleteList();
    this.resetFilterValues();
    this.formOnChanges();
  }

  /**
   * recharge la liste des pnc de l'autocompletion aprés 300ms
   */
  initAutocompleteList() {
    this.pncList = this.searchTerms
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(
        term => (term ? this.pncProvider.pncAutoComplete(term) : Observable.of<Pnc[]>([]))
      )
      .catch(error => {
        return Observable.of<Pnc[]>([]);
      });
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
  displayPnc(pnc: Pnc) {
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
    this.searchTerms.next(term);
  }

  /**
   * Fonction permettant de détecter et de gérer les changements de valeur des différents éléments du formulaire
   */
  formOnChanges() {
    this.searchForm.get('divisionControl').valueChanges.subscribe(val => {
      this.pncFilter.division = val;
      this.getSectorList(this.pncFilter.division);
    });

    this.searchForm.get('sectorControl').valueChanges.subscribe(val => {
      this.pncFilter.sector = val;
      this.getGinqList(this.pncFilter.sector);
    });

    this.searchForm.valueChanges.subscribe(val => {
      this.pncFilter.ginq = val.ginqControl;
      this.pncFilter.speciality = val.specialityControl;
      this.pncFilter.aircraftSkill = val.aircraftSkillControl;
      this.pncFilter.relay = val.relayControl;
      this.search();
    });
  }



  /**
   * Charge la liste des secteurs associé a la division choisi
   * @param sector secteur concerné.
   */
  getSectorList(division) {
    this.ginqList = null;
    this.sectorList = null;
    if (division !== AppConstant.ALL) {
      this.sectorList = Object.keys(this.sessionService.parameters.params['divisions'][division]);
    }
    this.pncFilter.sector = AppConstant.ALL;
    this.pncFilter.ginq = AppConstant.ALL;
  }

  /**
   * Charge la liste des ginq associé au secteur choisi
   * @param sector secteur concerné.
   */
  getGinqList(sector) {
    this.ginqList = null;
    if (this.pncFilter.division !== AppConstant.ALL && sector !== '' && sector !== AppConstant.ALL) {
      this.ginqList = this.sessionService.parameters.params['divisions'][this.pncFilter.division][sector];
    }
    this.pncFilter.ginq = AppConstant.ALL;
  }

  /**
   * Redirige vers la page d'accueil du pnc ou du cadre
   * @param pnc le pnc concerné
   */
  openPncHomePage(pnc: Pnc) {
    this.selectedPnc = undefined;
    this.initAutocompleteList();
    // Si on va sur un PNC par la recherche, on suprime de la session une enventuelle rotation.
    this.sessionService.appContext.lastConsultedRotation = null;
    this.navCtrl.push(PncHomePage, { matricule: pnc.matricule });
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
