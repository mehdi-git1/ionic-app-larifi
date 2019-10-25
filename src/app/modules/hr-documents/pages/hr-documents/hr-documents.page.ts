import { NavController } from 'ionic-angular';

import { Component } from '@angular/core';

import { AppConstant } from '../../../../app.constant';
import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { TabHeaderEnum } from '../../../../core/enums/tab-header.enum';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import {
    OnlineHrDocumentService
} from '../../../../core/services/hr-documents/online-hr-document.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { HrDocumentCreatePage } from '../hr-document-create/hr-document-create.page';

@Component({
    selector: 'hr-documents',
    templateUrl: 'hr-documents.page.html',
})
export class HrDocumentsPage {

    searchInProgress = false;
    pnc: PncModel;
    hrDocuments: HrDocumentModel[];
    totalHrDocuments: number;
    pageSize: number;
    page: number;
    sizeOfThePage: number;
    itemOffset: number;

    TabHeaderEnum = TabHeaderEnum;
    constructor(private sessionService: SessionService, private navCtrl: NavController, private onlineHrDocumentService: OnlineHrDocumentService,
        private securityService: SecurityService, private connectivityService: ConnectivityService) {
        this.sizeOfThePage = 0;
        this.page = 0;
    }

    ionViewWillEnter() {
        if (this.sessionService.visitedPnc) {
            this.pnc = this.sessionService.visitedPnc;
        } else {
            this.pnc = this.sessionService.getActiveUser().authenticatedPnc;
        }
        this.totalHrDocuments = 0;
        this.pageSize = AppConstant.pageSize;
        this.itemOffset = 0;
        this.getHrDocuments(this.pnc.matricule);
    }

    /**
     * Dirige vers la page de création d'un nouvel objectif
     */
    createNewDocument() {
        this.navCtrl.push(HrDocumentCreatePage, { mode: HrDocumentModeEnum.CREATION });
    }

    canCreateDocument() {
        return this.securityService.isManager();
    }

    loadingIsOver() {
        return this.hrDocuments && this.hrDocuments != undefined;
    }

    /**
     * Récupère les documents RH du Pnc
     * @param matricule le matricule du Pnc
     */
    private getHrDocuments(matricule: string) {
        this.searchInProgress = true;
        this.page = this.itemOffset / this.pageSize;
        this.sizeOfThePage = this.pageSize;
        this.hrDocuments = [];

        this.onlineHrDocumentService.getHrDocuments(matricule, this.page, this.sizeOfThePage).then(pagedHrDocument => {
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
    doInfinite(infiniteScroll): Promise<any> {
        return new Promise((resolve) => {
            if (this.hrDocuments.length < this.totalHrDocuments) {
                if (this.connectivityService.isConnected()) {
                    ++this.page;
                    this.onlineHrDocumentService.getHrDocuments(this.pnc.matricule, this.page, this.sizeOfThePage).then(pagedHrDocument => {
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
    lastPageReached(): boolean {
        return this.hrDocuments ? this.hrDocuments.length > 0 && this.hrDocuments.length >= this.totalHrDocuments : true;
    }

    /**
     * Vérifie si il y a des pièces jointes
     * @return true si il y a des pièces jointes, false sinon
     */
    hrDocumentHasAttachments(hrDocument: HrDocumentModel): boolean {
        return hrDocument.attachmentFiles && hrDocument.attachmentFiles.length > 0;
    }
}
