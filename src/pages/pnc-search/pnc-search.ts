import { Speciality } from './../../models/speciality';
import { PncFilter } from './../../models/pncFilter';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { ToastProvider } from './../../providers/toast/toast';
import { ConnectivityService } from './../../services/connectivity.service';
import { CrewMember } from './../../models/crewMember';
import { SessionService } from './../../services/session.service';
import { PncHomePage } from './../pnc-home/pnc-home';
import { GenderProvider } from './../../providers/gender/gender';
import { AppConfig } from './../../app/app.config';
import { PncProvider } from './../../providers/pnc/pnc';
import { TranslateService } from '@ngx-translate/core';
import { Pnc } from './../../models/pnc';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


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

  // Les listes des donnÃ©es du filtre
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

  constructor(
    public translate: TranslateService,
    private formBuilder: FormBuilder,
    private pncProvider: PncProvider,
    private genderProvider: GenderProvider,
    private sessionService: SessionService,
    private connectivityService: ConnectivityService,
    private toastProvider: ToastProvider) {

    // Initialisation du formulaire
    this.initForm();
    // initialistation du filtre
    this.initFilter();
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
    this.pncFilter.showFilter = true;
    this.pncFilter.icone = 'remove-circle';
    this.pageSize = AppConfig.pageSize;
    this.itemOffset = 0;
    this.specialityList = Object.keys(Speciality)
      .map(k => Speciality[k])
      .filter(v => typeof v === 'string') as string[];
    /*if (this.sessionService.parameters !== undefined) {
      const params: Map<string, any> = this.sessionService.parameters.params;
      this.divisionList = Object.keys(params['divisions']);
      if (this.divisionList.length === 0) {
        this.outOfDivision = true;
      } else {
        this.outOfDivision = false;
        this.relayList = params['relays'];
        this.aircraftSkillList = params['aircraftSkills'];
      }
    }*/
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

    // this.initAutocompleteList();
  }

  /**
   * compare deux valeurs et renvois true si elles sont Ã©gales
   * @param e1 premiere valeur a comparÃ©e
   * @param e2 Deuxieme valeur Ã  comparÃ©e
   */
  compareFn(e1: string, e2: string): boolean {
    if (e1 === e2) {
      return true;
    }
    return false;
  }

  /**
   * recupere 10 pnc correspondant aux criteres saisis du filtre.
   */
  searchPncs() {
    this.searchInProgress = true;
    this.pncProvider.getFilteredPncs().then(pagedPnc => {
      this.searchInProgress = false;
      this.filteredPncs = pagedPnc.content;
      this.totalPncs = pagedPnc.page.totalElements;
    }).catch((err) => {
      this.searchInProgress = false;
      this.toastProvider.error(this.translate.instant('PNC_SEARCH.ERROR.SEARCH'));
    }
    );
  }

  /**
  * Ouvre/ferme le filtre
  */
  toggleFilter() {
    this.pncFilter.showFilter = !this.pncFilter.showFilter;
    if (this.pncFilter.showFilter) {
      this.pncFilter.icone = 'remove-circle';
    } else {
      this.pncFilter.icone = 'add-circle';
    }
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
