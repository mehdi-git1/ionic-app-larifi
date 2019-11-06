

import { NavParams } from 'ionic-angular';

import { Component, OnInit, ViewChild } from '@angular/core';

import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';
import { PncLightModel } from '../../../../core/models/pnc-light.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    OnlineHrDocumentService
} from '../../../../core/services/hr-documents/online-hr-document.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { HrDocumentComponent } from '../../components/hr-document/hr-document.component';

@Component({
    selector: 'hr-document-create',
    templateUrl: 'hr-document-create.page.html',
})
export class HrDocumentCreatePage implements OnInit {

    pnc: PncModel;
    mode: HrDocumentModeEnum;
    hrDocument: HrDocumentModel;

    HrDocumentModeEnum = HrDocumentModeEnum;

    @ViewChild('hrDocumentCreate') hrDocumentCreate: HrDocumentComponent;

    constructor(private navParams: NavParams,
        private onlineHrDocumentService: OnlineHrDocumentService,
        private sessionService: SessionService) {
    }

    ngOnInit() {
        if (this.sessionService.visitedPnc) {
            this.pnc = this.sessionService.visitedPnc;
        } else {
            this.pnc = this.sessionService.getActiveUser().authenticatedPnc;
        }
        this.mode = this.navParams.get('mode');
        if (this.mode === HrDocumentModeEnum.EDITION) {
            const id = this.navParams.get('hrDocumentId');
            if (id) {
                this.onlineHrDocumentService.getHrDocument(id).then(hrDocument => {
                    this.hrDocument = hrDocument;
                }, error => {
                });
            }
        } else {
            this.hrDocument = new HrDocumentModel();
            this.hrDocument.pnc = new PncLightModel();
            this.hrDocument.pnc.matricule = this.pnc.matricule;
        }
    }

    ionViewCanLeave() {
        return this.hrDocumentCreate.confirmCancel();
    }

    loadingIsOver() {
        return this.hrDocument && this.hrDocument !== undefined;
    }
}
