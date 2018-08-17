import { AppConstant } from './../../app/app.constant';
import { Config } from './../../configuration/environment-variables/config';
import { PncHomePage } from './../pnc-home/pnc-home';
import { PncFilter } from './../../models/pncFilter';
import { Observable } from 'rxjs/Rx';
import { ToastProvider } from './../../providers/toast/toast';
import { ConnectivityService } from './../../services/connectivity.service';
import { CrewMember } from './../../models/crewMember';
import { SessionService } from './../../services/session.service';
import { GenderProvider } from './../../providers/gender/gender';
import { PncProvider } from './../../providers/pnc/pnc';
import { TranslateService } from '@ngx-translate/core';
import { Pnc } from './../../models/pnc';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Speciality } from '../../models/speciality';
import { Subject } from 'rxjs/Rx';

@Component({
    selector: 'page-pnc-search',
    templateUrl: 'pnc-search.html',
})
export class PncSearchPage implements OnInit {

    // Valeur par défaut des filtres
    ALL = 'ALL';

    pncList: Observable<Pnc[]>;
    filteredPncs: Pnc[];
    searchInProgress = false;

    searchForm: FormGroup;
    pncMatriculeControl: AbstractControl;
    selectedPnc: Pnc;

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
        private config: Config) {
    }

    ngOnInit() {
        // initialistation du filtre
        this.initFilter();
        // Initialisation du formulaire
        this.initForm();
    }

    ionViewDidEnter() {
        this.totalPncs = 0;
        this.pageSize = AppConstant.pageSize;
    }

    /**
     * Initialise le filtre, le nombre de pnc à afficher par page et les données des listes de recherche.
     */
    initFilter() {
        this.pncFilter = new PncFilter();
        this.showFilter = true;
        this.pageSize = AppConstant.pageSize;
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
        this.pncFilter.page = 0;
        this.pncFilter.size = 0;
        this.pncFilter.sortColumn = '';
        this.pncFilter.sortDirection = '';
        this.pncFilter.division = this.ALL;
        this.pncFilter.sector = this.ALL;
        this.pncFilter.ginq = this.ALL;
        this.pncFilter.speciality = this.ALL;
        this.pncFilter.aircraftSkill = this.ALL;
        this.pncFilter.relay = this.ALL;
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
            divisionControl: [this.pncFilter.division],
            sectorControl: [this.pncFilter.sector],
            ginqControl: [this.pncFilter.ginq],
            specialityControl: [this.pncFilter.speciality],
            aircraftSkillControl: [this.pncFilter.aircraftSkill],
            relayControl: [this.pncFilter.relay],
        });

        this.pncMatriculeControl = this.searchForm.get('pncMatriculeControl');

        this.initAutocompleteList();
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
        });
    }

    /**
   * charge la liste des secteurs associé a la division choisi
   * @param sector secteur concerné.
   */
    getSectorList(division) {
        this.ginqList = null;
        this.sectorList = null;
        if (division !== this.ALL) {
            this.sectorList = Object.keys(this.sessionService.parameters.params['divisions'][division]);
        }
        this.pncFilter.sector = this.ALL;
        this.pncFilter.ginq = this.ALL;
    }

    /**
     * charge la liste des ginq associé au secteur choisi
     * @param sector secteur concerné.
     */
    getGinqList(sector) {
        this.ginqList = null;
        if (this.pncFilter.division !== this.ALL && sector !== '' && sector !== this.ALL) {
            this.ginqList = this.sessionService.parameters.params['divisions'][this.pncFilter.division][sector];
        }
        this.pncFilter.ginq = this.ALL;
    }


    /**
     * compare deux valeurs et renvois true si elles sont égales
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
     * Redirige vers la page d'accueil du pnc ou du cadre
     * @param pnc le pnc concerné
     */
    openPncHomePage(pnc: Pnc) {
        this.selectedPnc = undefined;
        this.initAutocompleteList();
        this.navCtrl.push(PncHomePage, { matricule: pnc.matricule });
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
            if (pncFilter[param] === undefined || pncFilter[param] === 'undefined' || pncFilter[param] === '' || pncFilter[param] === this.ALL) {
                delete pncFilter[param];
            }
        }
        return pncFilter;
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
            if (this.filteredPncs.length < this.totalPncs) {
                this.pncFilter.page = ++this.pncFilter.page;
                this.getFilledFieldsOnly(this.pncFilter);
                this.pncProvider.getFilteredPncs(this.pncFilter).then(pagedPnc => {
                    this.filteredPncs.push(...pagedPnc.content);
                    resolve();
                });
            } else {
                infiniteScroll.enable(false);
            }
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
