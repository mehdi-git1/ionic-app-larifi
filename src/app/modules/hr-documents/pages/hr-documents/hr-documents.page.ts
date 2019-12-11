import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

import { AppConstant } from '../../../../app.constant';
import { TabHeaderEnum } from '../../../../core/enums/tab-header.enum';
import { HrDocumentFilterModel } from '../../../../core/models/hr-document-filter.model';
import { HrDocumentCategory } from '../../../../core/models/hr-document/hr-document-category';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import {
    OnlineHrDocumentService
} from '../../../../core/services/hr-documents/online-hr-document.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { SessionService } from '../../../../core/services/session/session.service';
import {
    HrDocumentActionMenuComponent
} from '../hr-document-action-menu/hr-document-action-menu.component';

@Component({
    selector: 'hr-documents',
    templateUrl: 'hr-documents.page.html',
    styleUrls: ['./hr-documents.page.scss']
})
export class HrDocumentsPage implements OnInit {

    searchInProgress = false;
    pnc: PncModel;
    hrDocuments: HrDocumentModel[];
    totalHrDocuments: number;
    sizeOfThePage: number;

    valueAll = AppConstant.ALL;
    hrDocumentCategories: HrDocumentCategory[];

    hrDocumentFilter: HrDocumentFilterModel;

    TabHeaderEnum = TabHeaderEnum;
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private sessionService: SessionService,
        private onlineHrDocumentService: OnlineHrDocumentService,
        private securityService: SecurityService,
        private connectivityService: ConnectivityService,
        private popoverCtrl: PopoverController) {
        this.sizeOfThePage = 0;
        this.initFilter();
    }

    ngOnInit() {
        this.hrDocumentFilter.size = AppConstant.pageSize;
        this.hrDocumentFilter.offset = 0;
        this.hrDocumentFilter.page = 0;
        this.sizeOfThePage = 0;

        if (this.sessionService.getActiveUser().appInitData !== undefined) {
            this.hrDocumentCategories = this.sessionService.getActiveUser().appInitData.hrDocumentCategories;
        }

    }

    ionViewDidEnter() {
        if (this.sessionService.visitedPnc) {
            this.pnc = this.sessionService.visitedPnc;
        } else {
            this.pnc = this.sessionService.getActiveUser().authenticatedPnc;
        }
        this.totalHrDocuments = 0;
        this.hrDocumentFilter.size = AppConstant.pageSize;
        this.hrDocumentFilter.offset = 0;
        this.searchHrDocuments();
    }

    /**
     * Initialise le contenu de la page.
     */
    initPage() {
        this.ngOnInit();
        this.ionViewDidEnter();
    }

    /**
     * Initialise les filtres utilisés pour la recherche
     */
    initFilter() {
        this.hrDocumentFilter = new HrDocumentFilterModel();
        // Tri
        this.hrDocumentFilter.sortColumn = 'creationDate';
        this.hrDocumentFilter.sortDirection = 'DESC';
        this.hrDocumentFilter.categoryId = this.valueAll;
    }

    /**
     * Dirige vers la page de création d'un nouveau document RH
     */
    createNewDocument() {
        this.router.navigate(['create', 0], { relativeTo: this.activatedRoute });
    }

    /**
     * Dirige vers la page de détails d'un document RH
     */
    viewDocumentDetails(hrDocument: HrDocumentModel) {
        this.router.navigate(['detail', hrDocument.techId], { relativeTo: this.activatedRoute });
    }

    /**
     * Vérifie si on peut créer un document RH
     * @return true si on est Manager et qu'on est en ligne
     */
    canCreateDocument() {
        return this.securityService.isManager() && this.connectivityService.isConnected();
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver() {
        return this.hrDocuments && this.hrDocuments !== undefined;
    }

    /**
     * Récupère les documents RH du Pnc
     */
    searchHrDocuments() {
        this.searchInProgress = true;
        this.hrDocumentFilter.page = this.hrDocumentFilter.offset / this.hrDocumentFilter.size;
        this.hrDocumentFilter.matricule = this.pnc.matricule;

        this.onlineHrDocumentService.getHrDocumentPageByFilter(this.hrDocumentFilter).then(pagedHrDocument => {
            this.hrDocuments = pagedHrDocument.content;
            this.totalHrDocuments = pagedHrDocument.page.totalElements;
            this.searchInProgress = false;
        }, error => {
            this.searchInProgress = false;
        });
    }

    /**
     * Permet de recharger les éléments dans la liste à scroller quand on arrive a la fin de la liste.
     * @param infiniteScroll
     */
    doInfinite(event) {
        if (this.hrDocuments.length < this.totalHrDocuments) {
            if (this.connectivityService.isConnected()) {
                ++this.hrDocumentFilter.page;
                this.onlineHrDocumentService.getHrDocumentPageByFilter(this.hrDocumentFilter).then(pagedHrDocument => {
                    this.hrDocuments.push(...pagedHrDocument.content);
                    event.target.complete();
                });
            } else {
            }
        } else {
            event.target.disabled = true;
        }
    }

    /**
     * Vérifie si on a atteint la dernière page
     */
    isLastPageReached(): boolean {
        return this.hrDocuments ? this.hrDocuments.length > 0 && this.hrDocuments.length >= this.totalHrDocuments : true;
    }

    /**
     * Récupère la page suivante de la recherche
     */
    loadNextPage() {
        this.searchInProgress = true;
        this.hrDocumentFilter.page = ++this.hrDocumentFilter.page;
        this.onlineHrDocumentService.getHrDocumentPageByFilter(
            this.hrDocumentFilter).then(pagedHrDocument => {
                this.hrDocuments = this.hrDocuments.concat(pagedHrDocument.content);
            }).then(() => {
                this.searchInProgress = false;
            });
    }

    /**
     * Vérifie si il y a des pièces jointes
     * @return true si il y a des pièces jointes, false sinon
     */
    hrDocumentHasAttachments(hrDocument: HrDocumentModel): boolean {
        return hrDocument.attachmentFiles && hrDocument.attachmentFiles.length > 0;
    }

    /**
     * Trie une colonne
     * @param columnName le nom de la colonne
     */
    sortColumn(columnName: string) {
        this.hrDocumentFilter.sortColumn = columnName;
        this.hrDocumentFilter.sortDirection = this.hrDocumentFilter.sortDirection === 'ASC' ? 'DESC' : 'ASC';
        this.searchHrDocuments();
    }

    /**
     * filtre par categorie
     * @param filter L'id de la categorie
     */
    filterCategory(filter: string) {
        this.hrDocumentFilter.categoryId = filter;
        this.searchHrDocuments();
    }

    /**
     * Vérifie que l'on est en mode connecté
     * @return true si on est en mode connecté, false sinon
     */
    isConnected(): boolean {
        return this.connectivityService.isConnected();
    }

    /**
     * Ouvre la popover de description d'un item
     * @param myEvent  l'évènementt
     * @param hrDocument le document RH concerné
     */
    openActionsMenu(myEvent: Event, hrDocument: HrDocumentModel) {
        myEvent.stopPropagation();
        this.popoverCtrl.create({
            component: HrDocumentActionMenuComponent,
            event: myEvent,
            cssClass: 'action-menu-popover'
        }).then(popover => {
            popover.present();

            popover.onDidDismiss().then(dismissEvent => {
                if (dismissEvent.data === 'hrDocument:create') {
                    this.router.navigate(['create', hrDocument.techId], { relativeTo: this.activatedRoute });
                }
            });
        });
    }

    /**
     * Vérifie si le PNC est manager
     * @return vrai si le PNC est manager, faux sinon
     */
    isManager(): boolean {
        return this.securityService.isManager();
    }
}
