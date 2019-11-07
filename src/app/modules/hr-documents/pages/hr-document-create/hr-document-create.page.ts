


import { Component, OnInit, ViewChild } from '@angular/core';

import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';
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

    @ViewChild('hrDocumentCreateOrUpdate', { static: false }) hrDocumentCreateOrUpdate: HrDocumentComponent;

    constructor(
        private onlineHrDocumentService: OnlineHrDocumentService,
        private sessionService: SessionService) {
    }

    ngOnInit() {
        if (this.sessionService.visitedPnc) {
            this.pnc = this.sessionService.visitedPnc;
        } else {
            this.pnc = this.sessionService.getActiveUser().authenticatedPnc;
        }
        // this.mode = this.navParams.get('mode');
        // if (this.mode === HrDocumentModeEnum.EDITION) {
        //     const id = this.navParams.get('hrDocumentId');
        //     if (id) {
        //         this.onlineHrDocumentService.getHrDocument(id).then(hrDocument => {
        //             this.hrDocument = hrDocument;
        //         }, error => {
        //         });
        //     }
        // }
    }

    ionViewCanLeave() {
        return this.hrDocumentCreateOrUpdate.confirmCancel();
    }

    loadingIsOver() {
        return this.mode === HrDocumentModeEnum.CREATION || this.hrDocument && this.hrDocument !== undefined;
    }
}
