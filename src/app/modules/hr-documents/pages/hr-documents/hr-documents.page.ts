import { NavController } from 'ionic-angular';

import { Component } from '@angular/core';

import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { TabHeaderEnum } from '../../../../core/enums/tab-header.enum';
import { PncModel } from '../../../../core/models/pnc.model';
import { SessionService } from '../../../../core/services/session/session.service';
import { HrDocumentCreatePage } from '../hr-document-create/hr-document-create.page';
import { HrDocumentDetailPage } from '../hr-document-detail/hr-document-detail.page.';

@Component({
    selector: 'hr-documents',
    templateUrl: 'hr-documents.page.html',
})
export class HrDocumentsPage {

    pnc: PncModel;
    TabHeaderEnum = TabHeaderEnum;
    constructor(private sessionService: SessionService, private navCtrl: NavController) {
    }

    ionViewWillEnter() {
        if (this.sessionService.visitedPnc) {
            this.pnc = this.sessionService.visitedPnc;
        } else {
            this.pnc = this.sessionService.getActiveUser().authenticatedPnc;
        }
    }

    /**
     * Dirige vers la page de création d'un nouvel objectif
     */
    createNewDocument() {
        this.navCtrl.push(HrDocumentCreatePage, { mode: HrDocumentModeEnum.CREATION });
    }

    tmpViewDetailsDocument() {
        this.navCtrl.push(HrDocumentDetailPage, { mode: HrDocumentModeEnum.EDITION, hrDocumentId: '1' });
    }

    canCreateDocument() {
        return true;
    }

    loadingIsOver() {
        return true;
    }
}
