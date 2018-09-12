import { Utils } from './../../common/utils';
import { ConnectivityService } from './../../services/connectivity.service';
import { NavController, Events, Keyboard } from 'ionic-angular';
import { PncProvider } from './../../providers/pnc/pnc';
import { Subject } from 'rxjs/Rx';
import { SessionService } from './../../services/session.service';
import { PncHomePage } from './../../pages/pnc-home/pnc-home';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
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

  // Défini la position top de la liste d'autocomplete
  autoCompleteTopPosition = -1;

  // Défini si une recherche d'autocomplete est en cours
  // Permet de gérer l'affichage du spinner de l'autocomplete
  autoCompleteRunning = false;

  constructor(private navCtrl: NavController,
    private sessionService: SessionService,
    private formBuilder: FormBuilder,
    private pncProvider: PncProvider,
    private connectivityService: ConnectivityService,
    private events: Events,
    private keyboard: Keyboard,
    private utils: Utils) {
    this.connectivityService.connectionStatusChange.subscribe(connected => {
      this.initFilter();
    });

    this.events.subscribe('parameters:ready', () => {
      this.initFilter();
    });

     /**
     * Action lorsque le clavier s'affiche
     */
    this.keyboard.didShow.subscribe(() => {
      this.checkIfAutoCompleteIsOpen();
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
   * Vérifie toutes les 200ms que l'element d'autocomplete existe
   */
  checkIfAutoCompleteIsOpen(){
    setTimeout(() => {
      if ($('#mat-autocomplete-0').length != 0){
        this.changeHeightOnOpen();
      }else{
        this.checkIfAutoCompleteIsOpen();
      }
    }, 200);
  }

  /**
   * Change la max-height de l'autocomplete en fonction de la taille de l'affichage disponible
   */
  changeHeightOnOpen(){
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

    this.pncFilter.division = this.divisionList && this.divisionList.length === 1 ? this.divisionList[0] : AppConstant.ALL;
    this.pncFilter.sector = this.sectorList && this.sectorList.length === 1 ? this.sectorList[0] : AppConstant.ALL;
    this.pncFilter.ginq = this.ginqList && this.ginqList.length === 1 ? this.ginqList[0] : AppConstant.ALL;
    this.pncFilter.speciality = this.specialityList && this.specialityList.length === 1 ? this.specialityList[0] : AppConstant.ALL;
    this.pncFilter.aircraftSkill = this.aircraftSkillList && this.aircraftSkillList.length === 1 ? this.aircraftSkillList[0] : AppConstant.ALL;
    this.pncFilter.relay = this.relayList && this.relayList.length === 1 ? this.relayList[0] : AppConstant.ALL;

  }

  /**
   * Réinitialise les valeurs des filtres de recherche
   */
  resetFilterValues() {
    this.searchForm.get('divisionControl').setValue(this.divisionList && this.divisionList.length === 1 ? this.divisionList[0] : AppConstant.ALL);
    this.searchForm.get('sectorControl').setValue(this.sectorList && this.sectorList.length === 1 ? this.sectorList[0] : AppConstant.ALL);
    this.searchForm.get('ginqControl').setValue(this.ginqList && this.ginqList.length === 1 ? this.ginqList[0] : AppConstant.ALL);
    this.searchForm.get('specialityControl').setValue(this.specialityList && this.specialityList.length === 1 ? this.specialityList[0] : AppConstant.ALL);
    this.searchForm.get('aircraftSkillControl').setValue(this.aircraftSkillList && this.aircraftSkillList.length === 1 ? this.aircraftSkillList[0] : AppConstant.ALL);
    this.searchForm.get('relayControl').setValue(this.relayList && this.relayList.length === 1 ? this.relayList[0] : AppConstant.ALL);
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
    this.divisionOnchanges();
    this.sectorOnchanges();
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
        term => (term ? this.getAutoCompleteDataReturn(term) : Observable.of<Pnc[]>([]))
      )
      .catch(error => {
        return Observable.of<Pnc[]>([]);
      });
  }

  /**
   * Gére plus finement le retour de l'autocomplete
   * @param term termes à rechercher pour l'autocomplete
   */
  getAutoCompleteDataReturn(term){
    return from(this.pncProvider.pncAutoComplete(term).then (
        data => {
          this.autoCompleteRunning = false;
          return data;
      }));
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
    this.checkIfAutoCompleteIsOpen();
    term = this.utils.replaceSpecialCaracters(term);
    if (!/^[a-zA-Z0-9-]+$/.test(term)){
      this.pncMatriculeControl.setValue(term.substring(0, term.length - 1));
    }else{
      this.pncMatriculeControl.setValue(term);
      this.autoCompleteRunning = true;
      this.searchTerms.next(term);
    }
  }

  /**
   * Retourne true si une recherche d'autocomplete est en cours
   */
  isAutoCompleteRunning(){
    return this.autoCompleteRunning;
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
      this.search();
    });
  }

  /**
   * Active le rechargement des secteurs à chaque modification de division
   */
  divisionOnchanges() {
    this.searchForm.get('divisionControl').valueChanges.subscribe(val => {
      this.pncFilter.division = val;
      this.getSectorList(this.pncFilter.division);
    });
  }

    /**
   * Active le rechargement des ginqs à chaque modification de secteur
   */
  sectorOnchanges() {
    this.searchForm.get('sectorControl').valueChanges.subscribe(val => {
      this.pncFilter.sector = val;
      this.getGinqList(this.pncFilter.sector);
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
    if (this.sectorList && this.sectorList.length === 1) {
      this.pncFilter.sector = this.sectorList[0];
      this.searchForm.get('sectorControl').setValue(this.sectorList[0]);
    } else {
      this.pncFilter.sector = AppConstant.ALL;
    }
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
    if (this.ginqList && this.ginqList.length === 1) {
      this.pncFilter.ginq = this.ginqList[0];
      this.searchForm.get('ginqControl').setValue(this.ginqList[0]);
    } else {
      this.pncFilter.ginq = AppConstant.ALL;
    }
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
