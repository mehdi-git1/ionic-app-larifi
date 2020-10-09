import { from, Observable, Subject } from 'rxjs';
import { TabHeaderEnum } from 'src/app/core/enums/tab-header.enum';
import { PagedPncModel } from 'src/app/core/models/paged-pnc.model';
import { PncFilterModel } from 'src/app/core/models/pnc-filter.model';

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
    pageSizeOptions: number[];
    itemOffset: number;

    pageNumber: number;
    offset: number;
    sortColumn: string;
    sortDirection: string;

    searchMode: PncSearchModeEnum;

    pnc: PncModel;

    searchFilters = new Subject<PncFilterModel>();

    isMenuOpened = false;

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
        this.searchMode = this.activatedRoute.snapshot.paramMap.get('mode') ?
            PncSearchModeEnum[this.activatedRoute.snapshot.paramMap.get('mode')]
            : PncSearchModeEnum.FULL;

        this.searchFilters
            .switchMap(filter => this.handlePncSearch(filter))
            .subscribe(pagedPnc => {
                this.handleSearchResponse(pagedPnc);
            });
    }

    ngAfterViewInit() {
        this.initPage();
    }

    /**
     * Initialisation du contenu de la page.
     */
    initPage() {
        this.initSearchConfig();
        this.searchPncs();
    }

    /**
     * Initialise le nombre de pnc à afficher par page et les données des listes de recherche.
     */
    initSearchConfig() {
        this.totalPncs = 0;
        this.itemOffset = 0;
        this.pageNumber = 0;
        this.sortColumn = '';
        this.sortDirection = '';
    }

    /**
     * recupere 10 pnc correspondant aux criteres saisis du filtre.
     */
    searchPncs() {
        this.searchFilters.next(this.pncSearchFilter.pncFilter);
        this.isMenuOpened = false;
    }

    /**
     * Gère l'affichage de l'effectif à afficher en fonction des filtres
     * @param filter les filtres à appliquer
     * @Return la liste de PNC filtrée
     */
    handlePncSearch(filter: PncFilterModel): Observable<PagedPncModel> {
        this.searchInProgress = true;
        this.infiniteScroll.disabled = false;
        this.pageNumber = this.itemOffset / AppConstant.pageSize;
        this.filteredPncs = [];

        return from(this.pncService.getFilteredPncs(filter, this.pageNumber, AppConstant.pageSize).then(pagedPnc => {
            return pagedPnc;
        }).catch((err) => {
            return null;
        }));
    }

    /**
     * Gère L'affichage du contenu de la page
     * @param pagedPnc le contenu de la page filtrée à afficher
     */
    handleSearchResponse(pagedPnc: PagedPncModel) {
        if (pagedPnc !== null) {
            this.pncPhotoService.synchronizePncsPhotos(pagedPnc.content.map(pnc => pnc.matricule));
            this.filteredPncs = pagedPnc.content;
            this.totalPncs = pagedPnc.page.totalElements;
            this.searchInProgress = false;
        }
    }


    /**
     * Permet de recharger les éléments dans la liste à scroller quand on arrive a la fin de la liste.
     * @param event l'événement gérant le scroll
     */
    doInfinite(event) {
        if (this.filteredPncs.length < this.totalPncs) {
            if (this.connectivityService.isConnected()) {
                ++this.pageNumber;
                this.pncService.getFilteredPncs(this.pncSearchFilter.pncFilter, this.pageNumber, AppConstant.pageSize).then(pagedPnc => {
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

    /**
     * Ouvre/ferme le menu latéral contenant les filtres
     */
    toggleFiltersMenu() {
        this.isMenuOpened = !this.isMenuOpened;
    }
}
