


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';
import {
    OnlineHrDocumentService
} from '../../../../core/services/hr-documents/online-hr-document.service';

@Component({
    selector: 'hr-document-create',
    templateUrl: 'hr-document-create.page.html',
})
export class HrDocumentCreatePage implements OnInit {

    mode: HrDocumentModeEnum;
    hrDocument: HrDocumentModel;

    HrDocumentModeEnum = HrDocumentModeEnum;

    constructor(
        private activatedRoute: ActivatedRoute,
        private onlineHrDocumentService: OnlineHrDocumentService) {
    }

    ngOnInit() {
        const id = +this.activatedRoute.snapshot.paramMap.get('hrDocumentId');
        this.mode = id > 0 ? HrDocumentModeEnum.EDITION : HrDocumentModeEnum.CREATION;
        if (this.mode === HrDocumentModeEnum.EDITION) {
            this.onlineHrDocumentService.getHrDocument(id).then(hrDocument => {
                this.hrDocument = hrDocument;
            }, error => {
            });

        }
    }

    loadingIsOver() {
        return this.mode === HrDocumentModeEnum.CREATION || this.hrDocument && this.hrDocument !== undefined;
    }
}
