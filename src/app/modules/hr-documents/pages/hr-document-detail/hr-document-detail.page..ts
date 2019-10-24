import { NavParams } from 'ionic-angular';

import { Component, OnInit } from '@angular/core';

import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    OnlineHrDocumentsService
} from '../../../../core/services/hr-documents/hr-documents.service';

@Component({
    selector: 'hr-document-detail',
    templateUrl: 'hr-document-detail.page.html',
})
export class HrDocumentDetailPage implements OnInit {

    pnc: PncModel;
    mode: HrDocumentModeEnum;
    hrDocument: HrDocumentModel;
    loading: boolean;

    HrDocumentModeEnum = HrDocumentModeEnum;

    constructor(private navParams: NavParams, private onlineHrDocumentsService: OnlineHrDocumentsService) {
    }

    ngOnInit() {
        this.loading = true;
        this.mode = this.navParams.get('mode');
        const id = this.navParams.get('hrDocumentId');

        this.onlineHrDocumentsService.getHrDocument(id)
            .then(hrDocument => {
                this.hrDocument = hrDocument;
                this.loading = false;
            }, error => {
                this.loading = false;
            });
    }

    isLoading() {
        return this.loading;
    }
}
