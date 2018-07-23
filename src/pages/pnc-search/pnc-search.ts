import { AuthGuard } from './../../guard/auth.guard';
import { PncHomePage } from './../pnc-home/pnc-home';
import { PncFilter } from './../../models/pncFilter';
import { Observable } from 'rxjs/Rx';
import { ToastProvider } from './../../providers/toast/toast';
import { ConnectivityService } from './../../services/connectivity.service';
import { CrewMember } from './../../models/crewMember';
import { SessionService } from './../../services/session.service';
import { GenderProvider } from './../../providers/gender/gender';
import { AppConfig } from './../../app/app.config';
import { PncProvider } from './../../providers/pnc/pnc';
import { TranslateService } from '@ngx-translate/core';
import { Pnc } from './../../models/pnc';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Speciality } from '../../models/speciality';
import { Subject } from 'rxjs/Rx';

@IonicPage({
  name: 'PncSearchPage',
  segment: 'pncSearch',
  defaultHistory: ['PncHomePage']
})
@Component({
  selector: 'page-pnc-search',
  templateUrl: 'pnc-search.html',
})
export class PncSearchPage {

  pncList: Observable<Pnc[]>;
  filteredPncs: Pnc[];
  searchInProgress: boolean;

  searchForm: FormGroup;
  pncMatriculeControl: AbstractControl;
  selectedPnc: Pnc;

  // filtre de recherche
  pncFilter: PncFilter;
  // afficher/masquer le filtre
  showFilter: Boolean;

  // Les listes des données du filtre
  divisionList: string[];
  sectorList: string[];
  ginqList: string[];
  relayList: string[];
  aircraftSkillList: string[];
  specialityList: string[];

  totalPncs: number;
  pageSize: number;
  pageSizeOptions: number[];
  itemOffset: number;

  outOfDivision: boolean;

  searchTerms = new Subject<string>();

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public translateService: TranslateService,
    private formBuilder: FormBuilder,
    private pncProvider: PncProvider,
    private genderProvider: GenderProvider,
    private sessionService: SessionService,
    private connectivityService: ConnectivityService,
    private toastProvider: ToastProvider,
    private authGuard: AuthGuard ) {

    // Initialisation du formulaire
    this.initForm();
    // initialistation du filtre
    this.initFilter();
  }

  ionViewCanEnter() {
    return this.authGuard.guard().then(guardReturn => {
      if (guardReturn){
        return true;
      }else{
        return false;
      }
    });
  }

  ionViewDidLoad() {
    this.totalPncs = 0;
    this.pageSize = AppConfig.pageSize;
  }

  /**
   * Initialise le filtre, le nombre de pnc à afficher par page et les données des listes de recherche.
   */
  initFilter() {
    this.pncFilter = new PncFilter();
    this.showFilter = true;
    this.pageSize = AppConfig.pageSize;
    this.itemOffset = 0;
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
  }
  /**
   * charge la liste des secteurs associé a la division choisi
   * @param sector secteur concerné.
   */
  getSectorList(division) {
    this.ginqList = null;
    this.sectorList = null;
    if (division !== 'ALL') {
      this.sectorList = Object.keys(this.sessionService.parameters.params['divisions'][division]);
    }
    this.pncFilter.sector = '';
    this.pncFilter.ginq = '';
  }

  /**
   * charge la liste des ginq associé au secteur choisi
   * @param sector secteur concerné.
   */
  getGinqList(sector) {
    this.ginqList = null;
    if (this.pncFilter.division !== 'ALL' && sector !== '' && sector !== 'ALL') {
      this.ginqList = this.sessionService.parameters.params['divisions'][this.pncFilter.division][sector];
    }
    this.pncFilter.ginq = '';
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
   * Repmlie le matricule du filtre avec le matricule du pnc selectionné.
   */
  prepareFilter(): void {
    if (this.selectedPnc) {
      this.pncFilter.pncMatricule = this.selectedPnc.matricule;
    }
  }

  /**
   * Ajoute un terme au flux
   * @param term le terme à ajouter
   */
  search(term: string): void {
    this.searchTerms.next(term);
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
   * Initialise le formulaire
   */
  initForm() {
    this.searchForm = this.formBuilder.group({
      pncMatriculeControl: [
        '',
        Validators.compose([Validators.minLength(8), Validators.maxLength(8)])
      ],
      divisionControl: [''],
      sectorControl: [''],
      ginqControl: [''],
      specialityControl: [''],
      aircraftSkillControl: [''],
      relayControl: [''],
    });

    this.pncMatriculeControl = this.searchForm.get('pncMatriculeControl');

    this.initAutocompleteList();
  }

  /**
   * compare deux valeurs et renvois true si elles sont égales
   * @param e1 premiere valeur a comparée
   * @param e2 Deuxieme valeur à comparée
   */
  compareFn(e1: string, e2: string): boolean {
    if (e1 === e2) {
      return true;
    }
    return false;
  }

  /**
   * Redirige vers la page d'accueil du pnc ou du cadre
   * @param pnc le pnc concerné
   */
  openPncHomePage(pnc: Pnc) {
    this.selectedPnc = undefined;
    this.initAutocompleteList();
    this.navCtrl.push('PncHomePage', { matricule: pnc.matricule });
  }

  /**
   * recupere 10 pnc correspondant aux criteres saisis du filtre.
   */
  searchPncs() {
    this.searchInProgress = true;
    this.buildFilter();
    this.getFilledFieldsOnly(this.pncFilter);
    this.pncProvider.getFilteredPncs(this.pncFilter).then(pagedPnc => {
      this.searchInProgress = false;
      this.filteredPncs = pagedPnc.content;
      this.totalPncs = pagedPnc.page.totalElements;
    }).catch((err) => {
      this.searchInProgress = false;
      this.toastProvider.error(this.translateService.instant('PNC_SEARCH.ERROR.SEARCH'));
    }
    );
  }

  /**
   * Supprime les champs du filtre qui sont null ou vide.
   * @param pncFilter filtre de recherche.
   */
  getFilledFieldsOnly(pncFilter) {
    let param: string;
    for (param in pncFilter) {
      if (pncFilter[param] === undefined || pncFilter[param] === '') {
        delete pncFilter[param];
      }
    }
  }

  /**
   * Initialise le filtre de recherche.
   */
  buildFilter() {
    // Pagination
    this.pncFilter.page = this.itemOffset / this.pageSize;
    this.pncFilter.size = this.pageSize;
    this.filteredPncs = [];
  }

  /**
   * Permet de recharger les éléments dans la liste à scroller quand on arrive a la fin de la liste.
   * @param infiniteScroll
   */
  doInfinite(infiniteScroll): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.filteredPncs.length < this.totalPncs) {
          this.pncFilter.page = ++this.pncFilter.page;
          this.pncProvider.getFilteredPncs(this.pncFilter).then(pagedPnc => {
            this.filteredPncs.push(...pagedPnc.content);
          });
        } else {
          infiniteScroll.enable(false);
        }
        resolve();
      }, 500);
    });
  }

  /**
  * Ouvre/ferme le filtre
  */
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  createCrewMemberObjectFromPnc(pnc: Pnc) {
    const crewMember: CrewMember = new CrewMember();
    crewMember.pnc = pnc;
    return crewMember;
  }

  areFiltersDisabled(): boolean {
    return !this.connectivityService.isConnected();
  }

  inactiveFiltersLabelClass(): string {
    return this.connectivityService.isConnected() ? 'hide-label' : 'show-label';
  }
}
