import { SearchFilterComponent } from './../../components/search-filter/search-filter';
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
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Speciality } from '../../models/speciality';
import { Subject } from 'rxjs/Rx';
import { MAT_HAMMER_OPTIONS } from '@angular/material';

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

    @ViewChild(SearchFilterComponent)
    searchFilter: SearchFilterComponent;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public translateService: TranslateService,
        private pncProvider: PncProvider,
        private genderProvider: GenderProvider,
        private sessionService: SessionService,
        private connectivityService: ConnectivityService,
        private toastProvider: ToastProvider,
        private config: Config) {
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

        this.pncProvider.getFilteredPncs(this.searchFilter.pncFilter, this.page, this.sizeOfThePage).then(pagedPnc => {
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
                this.page = ++this.page;
                this.pncProvider.getFilteredPncs(this.searchFilter.pncFilter, this.page, this.sizeOfThePage).then(pagedPnc => {
                    this.filteredPncs.push(...pagedPnc.content);
                    resolve();
                });
            } else {
                infiniteScroll.enable(false);
            }
        });
    }

    createCrewMemberObjectFromPnc(pnc: Pnc) {
        const crewMember: CrewMember = new CrewMember();
        crewMember.pnc = pnc;
        return crewMember;
    }

}
