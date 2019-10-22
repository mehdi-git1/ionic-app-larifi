import { NavController } from 'ionic-angular';

import { Component } from '@angular/core';

import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { TabHeaderEnum } from '../../../../core/enums/tab-header.enum';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    OnlineHrDocumentService
} from '../../../../core/services/hr-documents/online-hr-document.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { HrDocumentCreatePage } from '../hr-document-create/hr-document-create.page';

@Component({
    selector: 'hr-documents',
    templateUrl: 'hr-documents.page.html',
})
export class HrDocumentsPage {

    pnc: PncModel;
    hrDocuments: HrDocumentModel[];

    TabHeaderEnum = TabHeaderEnum;
    constructor(private sessionService: SessionService, private navCtrl: NavController, private onlineHrDocumentService: OnlineHrDocumentService) {
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

    canCreateDocument() {
        return true;
    }

    loadingIsOver() {
        return true;
    }

    /**
     * Récupère les documents RH du Pnc
     * @param matricule le matricule du Pnc
     */
    private getHrDocuments(matricule: string) {
        this.onlineHrDocumentService.getHrDocuments(matricule).then(hrDocuments => {
            this.hrDocuments = hrDocuments;
        }, error => {
            this.hrDocuments = new Array<HrDocumentModel>();
        });
    }
}
