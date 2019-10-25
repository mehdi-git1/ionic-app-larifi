import { NavController } from 'ionic-angular';

import { Component } from '@angular/core';

import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { TabHeaderEnum } from '../../../../core/enums/tab-header.enum';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';
import { PncModel } from '../../../../core/models/pnc.model';
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
export class HrDocumentsPage {

    pnc: PncModel;
    hrDocuments: HrDocumentModel[];
    totalHrDocuments: number;
    page: number;
    sizeOfThePage: number;

    TabHeaderEnum = TabHeaderEnum;
    constructor(private sessionService: SessionService, private navCtrl: NavController, private onlineHrDocumentService: OnlineHrDocumentService,
        private securityService: SecurityService) {
        this.sizeOfThePage = 0;
        this.page = 0;
    }

    ionViewWillEnter() {
        if (this.sessionService.visitedPnc) {
            this.pnc = this.sessionService.visitedPnc;
        } else {
            this.pnc = this.sessionService.getActiveUser().authenticatedPnc;
        }
        this.getHrDocuments(this.pnc.matricule);
    }

    /**
     * Dirige vers la page de création d'un nouvel objectif
     */
    createNewDocument() {
        this.navCtrl.push(HrDocumentCreatePage, { mode: HrDocumentModeEnum.CREATION });
    }

    viewDetailedDocument(hrDocument: HrDocumentModel) {
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
     * @param matricule le matricule du Pnc
     */
    private getHrDocuments(matricule: string) {
        this.onlineHrDocumentService.getHrDocuments(matricule, this.page, this.sizeOfThePage).then(pagedHrDocument => {
            this.hrDocuments = pagedHrDocument.content;
        }, error => {
            this.hrDocuments = new Array<HrDocumentModel>();
        });
    }

    /**
     * Vérifie si il y a des pièces jointes
     * @return true si il y a des pièces jointes, false sinon
     */
    hrDocumentHasAttachments(hrDocument: HrDocumentModel): boolean {
        return hrDocument.attachmentFiles && hrDocument.attachmentFiles.length > 0;
    }
}
