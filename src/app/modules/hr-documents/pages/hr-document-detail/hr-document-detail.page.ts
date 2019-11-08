

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    OnlineHrDocumentService
} from '../../../../core/services/hr-documents/online-hr-document.service';

@Component({
    selector: 'hr-document-detail',
    templateUrl: 'hr-document-detail.page.html',
    styleUrls: ['./hr-document-detail.page.scss']
})
export class HrDocumentDetailPage implements OnInit {

    pnc: PncModel;
    hrDocument: HrDocumentModel;

    HrDocumentModeEnum = HrDocumentModeEnum;

    constructor(
        private activatedRoute: ActivatedRoute,
        private onlineHrDocumentService: OnlineHrDocumentService) {
    }

    ngOnInit() {
        const id = this.activatedRoute.snapshot.paramMap.get('hrDocumentId');

        this.onlineHrDocumentService.getHrDocument(+id)
            .then(hrDocument => {
                this.hrDocument = hrDocument;
            }, error => {
            });
    }

    loadingIsOver() {
        return this.hrDocument && this.hrDocument !== undefined && this.hrDocument != null;
    }
}
