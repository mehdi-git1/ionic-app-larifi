import { FormGroup, AbstractControl, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import $ from 'jquery';

import { TabNavEnum } from '../../../../core/enums/tab-nav.enum';
import { Utils } from '../../../../shared/utils/utils';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { NavController, Events, Keyboard } from 'ionic-angular';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { Subject } from 'rxjs/Rx';
import { SessionService } from '../../../../core/services/session/session.service';
import { PncHomePage } from '../../../home/pages/pnc-home/pnc-home.page';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { AppConstant } from '../../../../app.constant';
import { PncFilterModel } from '../../../../core/models/pnc-filter.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { TabNavService } from '../../../../core/services/tab-nav/tab-nav.service';
import { SpecialityEnum } from '../../../../core/enums/speciality.enum';


@Component({
  selector: 'pnc-search-filter',
  templateUrl: 'pnc-search-filter.component.html'
})
export class PncSearchFilterComponent implements OnInit {

  @Output() onSearch: EventEmitter<any> = new EventEmitter();

  defaultDivision: string;
  defaultSector: string;
  defaultGinq: string;
  defaultValue: Boolean;
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
  showFilter: Boolean = false;

  // Les listes des données du filtre
  divisionList: string[];
  sectorList: string[];
  ginqList: string[];
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
    private keyboard: Keyboard,
    private tabNavService: TabNavService
  ) {
    this.connectivityService.connectionStatusChange.subscribe(connected => {
      this.initFilter();
    });

    this.events.subscribe('parameters:ready', () => {
      this.initFilter();
      this.initForm();
    });

    /**
     * Action lorsque le clavier s'affiche
     */
    this.keyboard.didShow.subscribe(() => {
      this.checkIfAutoCompleteIsOpen();
      if (this.autoCompleteTopPosition != -1) {
        $('#cdk-overlay-0').css('top', this.autoCompleteTopPosition + 'px');
      }
    });

    /**
     * Action lorsque le clavier disparaît
     */
    this.keyboard.didHide.subscribe(() => {
      const newHeight = window.innerHeight - this.autoCompleteTopPosition;
      $('#cdk-overlay-0').css('top', this.autoCompleteTopPosition + 'px');
      setTimeout(() => { $('#mat-autocomplete-0').css('max-height', newHeight + 'px'); }, 5000);
    });
  }

  /**
   * Vérifie toutes les 200ms que l'element d'autocomplete existe
   */
  checkIfAutoCompleteIsOpen() {
    setTimeout(() => {
      if ($('#mat-autocomplete-0').length != 0) {
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
    this.autoCompleteTopPosition = this.autoCompleteTopPosition != -1 ? this.autoCompleteTopPosition : $('#cdk-overlay-0').offset().top;
    $('#cdk-overlay-0').css('top', this.autoCompleteTopPosition + 'px');
    $('#mat-autocomplete-0').css('max-height', window.innerHeight - this.autoCompleteTopPosition + 'px');
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
    this.pncFilter = new PncFilterModel();
    this.showFilter = true;
    this.specialityList = Object.keys(SpecialityEnum)
      .map(k => SpecialityEnum[k])
      .filter(v => typeof v === 'string') as string[];
    if (this.sessionService.parameters !== undefined) {
      const params: Map<string, any> = this.sessionService.parameters.params;
      this.divisionList = Object.keys(params['divisions']);
      if (this.divisionList.length === 0) {
        this.outOfDivision = true;
      } else {
        this.outOfDivision = false;
        this.relayList = params['relays'];
        this.relayList.sort((value: String, otherValue: String) => {
          return value > otherValue ? 1 : -1;
        });
        this.aircraftSkillList = params['aircraftSkills'];
      }
      this.defaultDivision = params['defaultDivision'];
      this.defaultSector = params['defaultSector'];
      this.defaultGinq = params['defaultGinq'];
    }

  }

  /**
   * Réinitialise les valeurs des filtres de recherche
   */
  resetFilterValues() {
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
    }
  }

  /**
    * recharge la liste des pnc de l'autocompletion aprés 300ms
    */
  initAutocompleteList() {
    this.pncList = this.searchTerms
      .debounceTime(300)
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
          $('#cdk-overlay-0').css('top', this.autoCompleteTopPosition + 'px');
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
    // On supprime le caractère entré s'il ne convient pas
    // A savoir si il n'est pas alphanumérique / -  et si la chaine n'est pas vide
    if (!/^[a-zA-Z0-9-]+$/.test(term) && term !== '') {
      this.pncMatriculeControl.setValue(term.substring(0, term.length - 1));
    } else {
      this.pncMatriculeControl.setValue(term);
      this.autoCompleteRunning = true;
      this.searchTerms.next(term);
    }
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
   * Charge la liste des secteurs associé a la division choisi
   * @param sector secteur concerné.
   */
  getSectorList(division) {
    this.ginqList = null;
    this.sectorList = null;
    if (division !== AppConstant.ALL) {
      this.sectorList = Object.keys(this.sessionService.parameters.params['divisions'][division]);
    }
    if (this.defaultValue && this.sectorList && this.defaultSector && this.sectorList.find((sector) => sector === this.defaultSector)) {
      this.pncFilter.sector = this.defaultSector;
      this.searchForm.get('sectorControl').setValue(this.defaultSector);
    } else {
      this.pncFilter.sector = AppConstant.ALL;
      this.searchForm.get('sectorControl').setValue(AppConstant.ALL);
    }
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
    if (this.defaultValue && this.ginqList && this.defaultGinq && this.ginqList.find((ginq) => ginq === this.defaultGinq)) {
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
    // Si on va sur un PNC par la recherche, on suprime de la session une enventuelle rotation.
    this.sessionService.appContext.lastConsultedRotation = null;
    if (this.sessionService.isActiveUser(pnc)) {
      this.navCtrl.parent.select(this.tabNavService.findTabIndex(TabNavEnum.PNC_HOME_PAGE));
    } else {
      this.navCtrl.push(PncHomePage, { matricule: pnc.matricule });
    }

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
