import { NavController } from 'ionic-angular';

import { Component, OnInit } from '@angular/core';

import { AppConstant } from '../../../../app.constant';
import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { TabHeaderEnum } from '../../../../core/enums/tab-header.enum';
import { HrDocumentFilterModel } from '../../../../core/models/hr-document-filter.model';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import {
    OnlineHrDocumentService
} from '../../../../core/services/hr-documents/online-hr-document.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { HrDocumentCreatePage } from '../hr-document-create/hr-document-create.page';
import { HrDocumentDetailPage } from '../hr-document-detail/hr-document-detail.page';

@Component({
    selector: 'hr-documents',
    templateUrl: 'hr-documents.page.html',
})
export class HrDocumentsPage implements OnInit {

    searchInProgress = false;
    pnc: PncModel;
    hrDocuments: HrDocumentModel[];
    totalHrDocuments: number;
    sizeOfThePage: number;

    hrDocumentFilter: HrDocumentFilterModel;

    TabHeaderEnum = TabHeaderEnum;
    constructor(
        private sessionService: SessionService,
        private navCtrl: NavController,
        private onlineHrDocumentService: OnlineHrDocumentService,
        private securityService: SecurityService,
        private connectivityService: ConnectivityService) {
        this.sizeOfThePage = 0;
        this.initFilter();
    }

    ngOnInit() {
        this.hrDocumentFilter.size = AppConstant.pageSize;
        this.hrDocumentFilter.offset = 0;
        this.hrDocumentFilter.page = 0;
        this.sizeOfThePage = 0;

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
     * Initialisation du contenu de la page.
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
    }

    /**
     * Dirige vers la page de création d'un nouvel objectif
     */
    createNewDocument() {
        this.navCtrl.push(HrDocumentCreatePage, { mode: HrDocumentModeEnum.CREATION });
    }

    viewDocumentDetails(hrDocument: HrDocumentModel) {
        this.navCtrl.push(HrDocumentDetailPage, { mode: HrDocumentModeEnum.EDITION, hrDocumentId: hrDocument.techId });
    }

    canCreateDocument() {
        return this.securityService.isManager();
    }

    loadingIsOver() {
        return this.hrDocuments && this.hrDocuments != undefined;
    }

    /**
     * Récupère les documents RH du Pnc
     */
    searchHrDocuments() {
        this.searchInProgress = true;
        this.hrDocumentFilter.page = this.hrDocumentFilter.offset / this.hrDocumentFilter.size;
        this.hrDocumentFilter.matricule = this.pnc.matricule;
        this.hrDocuments = [];

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
    doInfinite(infiniteScroll: any): Promise<any> {
        return new Promise((resolve) => {
            if (this.hrDocuments.length < this.totalHrDocuments) {
                if (this.connectivityService.isConnected()) {
                    ++this.hrDocumentFilter.page;
                    this.onlineHrDocumentService.getHrDocumentPageByFilter(this.hrDocumentFilter).then(pagedHrDocument => {
                        this.hrDocuments.push(...pagedHrDocument.content);
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
}
