import { TabNavService } from './../../providers/tab-nav/tab-nav.service';
import { PncSearchFilterComponent } from './../../components/pnc-search-filter/pnc-search-filter';
import { AppConstant } from './../../app/app.constant';
import { PncHomePage } from './../pnc-home/pnc-home';

import { ConnectivityService } from '../../services/connectivity/connectivity.service';
import { CrewMember } from './../../models/crewMember';
import { SessionService } from './../../services/session.service';

import { PncProvider } from './../../providers/pnc/pnc';
import { TranslateService } from '@ngx-translate/core';
import { Pnc } from './../../models/pnc';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


import { tabNavEnum } from './../../shared/enum/tab-nav.enum';

@Component({
    selector: 'page-pnc-search',
    templateUrl: 'pnc-search.html',
})
export class PncSearchPage implements OnInit {

    filteredPncs: Pnc[];
    searchInProgress = false;

    totalPncs: number;
    pageSize: number;
    pageSizeOptions: number[];
    itemOffset: number;

    page: number;
    sizeOfThePage: number;
    offset: number;
    sortColumn: string;
    sortDirection: string;

    @ViewChild(PncSearchFilterComponent)
    pncSearchFilter: PncSearchFilterComponent;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public translateService: TranslateService,
        private pncProvider: PncProvider,
        private sessionService: SessionService,
        private connectivityService: ConnectivityService,
        private tabNavService: TabNavService
    ) {
        this.sizeOfThePage = 0;
    }

    ngOnInit() {
        // initialistation des resultats de recherche
        this.initSearchResults();
    }

    ionViewDidEnter() {
        this.totalPncs = 0;
        this.pageSize = AppConstant.pageSize;
        this.searchPncs();
    }

    /**
     * Initialisation du contenu de la page.
     */
    initPage() {
        this.ngOnInit();
        this.ionViewDidEnter();
    }

    /**
     * Initialise le nombre de pnc à afficher par page et les données des listes de recherche.
     */
    initSearchResults() {
        this.pageSize = AppConstant.pageSize;
        this.itemOffset = 0;
        this.page = 0;
        this.sizeOfThePage = 0;
        this.sortColumn = '';
        this.sortDirection = '';
    }

    /**
     * recupere 10 pnc correspondant aux criteres saisis du filtre.
     */
    searchPncs() {
        this.searchInProgress = true;
        this.buildFilter();

        this.pncProvider.getFilteredPncs(this.pncSearchFilter.pncFilter, this.page, this.sizeOfThePage).then(pagedPnc => {
            this.searchInProgress = false;
            this.filteredPncs = pagedPnc.content;
            this.totalPncs = pagedPnc.page.totalElements;
        }).catch((err) => {
            this.searchInProgress = false;
        }
        );
    }

    /**
     * Initialise le filtre de recherche.
     */
    buildFilter() {
        // Pagination
        this.page = this.itemOffset / this.pageSize;
        this.sizeOfThePage = this.pageSize;
        this.filteredPncs = [];
    }

    /**
     * Permet de recharger les éléments dans la liste à scroller quand on arrive a la fin de la liste.
     * @param infiniteScroll
     */
    doInfinite(infiniteScroll): Promise<any> {
        return new Promise((resolve) => {
            if (this.filteredPncs.length < this.totalPncs) {
                if (this.connectivityService.isConnected()) {
                    ++this.page;
                    this.pncProvider.getFilteredPncs(this.pncSearchFilter.pncFilter, this.page, this.sizeOfThePage).then(pagedPnc => {
                        this.filteredPncs.push(...pagedPnc.content);
                        infiniteScroll.complete();
                        resolve();
                    });
                } else {
                    resolve();
                }
            } else {
                resolve();
            }
        });
    }

    /**Crée un objet CrewMember à partir d'un objet Pnc
     * @param pnc pnc à transformer
     */
    createCrewMemberObjectFromPnc(pnc: Pnc) {
        const crewMember: CrewMember = new CrewMember();
        crewMember.pnc = pnc;
        return crewMember;
    }

    /**
     * Redirige vers la page d'accueil du pnc ou du cadre
     * @param pnc le pnc concerné
     */
    openPncHomePage(pnc: Pnc) {
        // Si on va sur un PNC par la recherche, on suprime de la session une enventuelle rotation.
        this.sessionService.appContext.lastConsultedRotation = null;
        if (this.isMyHome(pnc.matricule)) {
            this.navCtrl.parent.select(this.tabNavService.findTabIndex(tabNavEnum.PNC_HOME_PAGE));
        } else {
            this.navCtrl.push(PncHomePage, { matricule: pnc.matricule });
        }
    }

    /**
     * Vérifie que la page courante est la homepage de la personne connectée
     * @return vrai si c'est le cas, faux sinon
     */
    isMyHome(matricule: string): boolean {
        return matricule === (this.sessionService.authenticatedUser && this.sessionService.authenticatedUser.matricule);
    }

    /**
     * Vérifie si on a atteint la dernière page de la recherche
     */
    lastPageReached(): boolean {
        return this.filteredPncs ? this.filteredPncs.length > 0 && this.filteredPncs.length >= this.totalPncs : true;
    }

}
