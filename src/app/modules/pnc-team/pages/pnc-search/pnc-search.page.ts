import { TabHeaderEnum } from 'src/app/core/enums/tab-header.enum';

import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Events, IonInfiniteScroll } from '@ionic/angular';

import { AppConstant } from '../../../../app.constant';
import { PncSearchModeEnum } from '../../../../core/enums/pnc-search-mode.enum';
import { PncModel } from '../../../../core/models/pnc.model';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { PncPhotoService } from '../../../../core/services/pnc-photo/pnc-photo.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';
import {
    PncSearchFilterComponent
} from '../../components/pnc-search-filter/pnc-search-filter.component';

@Component({
    selector: 'page-pnc-search',
    templateUrl: 'pnc-search.page.html',
    styleUrls: ['./pnc-search.page.scss']
})
export class PncSearchPage implements AfterViewInit {

    filteredPncs: PncModel[];
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

    searchMode: PncSearchModeEnum;

    pnc: PncModel;

    // Expose l'enum au template
    TabHeaderEnum = TabHeaderEnum;

    @ViewChild(PncSearchFilterComponent, { static: false }) pncSearchFilter: PncSearchFilterComponent;
    @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;

    constructor(
        private pncService: PncService,
        private pncPhotoService: PncPhotoService,
        private sessionService: SessionService,
        private connectivityService: ConnectivityService,
        private events: Events,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this.sizeOfThePage = 0;
        this.searchMode = this.activatedRoute.snapshot.paramMap.get('mode') ?
            PncSearchModeEnum[this.activatedRoute.snapshot.paramMap.get('mode')]
            : PncSearchModeEnum.FULL;
    }

    ngAfterViewInit() {
        this.initSearchConfig();
        this.searchPncs();
    }

    /**
     * Initialisation du contenu de la page.
     */
    initPage() {
        this.ngAfterViewInit();
    }

    /**
     * Initialise le nombre de pnc à afficher par page et les données des listes de recherche.
     */
    initSearchConfig() {
        this.totalPncs = 0;
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
        this.infiniteScroll.disabled = false;
        this.buildFilter();

        this.pncService.getFilteredPncs(this.pncSearchFilter.pncFilter, this.page, this.sizeOfThePage).then(pagedPnc => {
            this.pncPhotoService.synchronizePncsPhotos(pagedPnc.content.map(pnc => pnc.matricule));
            this.filteredPncs = pagedPnc.content;
            this.totalPncs = pagedPnc.page.totalElements;
            this.searchInProgress = false;
        }).catch((err) => {
            this.searchInProgress = false;
        });
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
     * @param event l'événement gérant le scroll
     */
    doInfinite(event) {
        if (this.filteredPncs.length < this.totalPncs) {
            if (this.connectivityService.isConnected()) {
                ++this.page;
                this.pncService.getFilteredPncs(this.pncSearchFilter.pncFilter, this.page, this.sizeOfThePage).then(pagedPnc => {
                    this.pncPhotoService.synchronizePncsPhotos(pagedPnc.content.map(pnc => pnc.matricule));
                    this.filteredPncs.push(...pagedPnc.content);
                    event.target.complete();
                });
            } else {
            }
        } else {
            event.target.disabled = true;
        }
    }

    /**
     * Redirige vers la page d'accueil du pnc ou du cadre
     * @param pnc le pnc concerné
     */
    openPncHomePage(pnc: PncModel) {
        // Si on va sur un PNC par la recherche, on suprime de la session une enventuelle rotation.
        this.sessionService.appContext.lastConsultedRotation = null;
        if (this.searchMode === PncSearchModeEnum.ALTERNANT) {
            this.router.navigate(['visit', pnc.matricule, 'development-program']);
        } else {
            this.events.publish('EDossier:visited', pnc);
        }
    }

    /**
     * Vérifie si on a atteint la dernière page de la recherche
     */
    lastPageReached(): boolean {
        return this.filteredPncs ? this.filteredPncs.length > 0 && this.filteredPncs.length >= this.totalPncs : true;
    }

    /**
     * Vérifie si on est sur la recherche d'alternant
     * @return vrai si on est sur la recherche d'alternant, faux sinon
     */
    isAlternantSearch() {
        return this.searchMode === PncSearchModeEnum.ALTERNANT;
    }
}
