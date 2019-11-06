

import { AlertController, NavParams } from 'ionic-angular';

import { Component, OnInit, ViewChild } from '@angular/core';

import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';
import {
    OnlineHrDocumentService
} from '../../../../core/services/hr-documents/online-hr-document.service';
import { HrDocumentComponent } from '../../components/hr-document/hr-document.component';

@Component({
    selector: 'hr-document-create',
    templateUrl: 'hr-document-create.page.html',
})
export class HrDocumentCreatePage implements OnInit {

    mode: HrDocumentModeEnum;
    hrDocument: HrDocumentModel;

    HrDocumentModeEnum = HrDocumentModeEnum;

    @ViewChild('hrDocumentCreate') hrDocumentCreate: HrDocumentComponent;

    constructor(private navParams: NavParams,
        private onlineHrDocumentService: OnlineHrDocumentService,
        private alertCtrl: AlertController) {
    }

    ngOnInit() {
        this.mode = this.navParams.get('mode');
        const id = this.navParams.get('hrDocumentId');
        if (id) {
            this.onlineHrDocumentService.getHrDocument(id).then(hrDocument => {
                this.hrDocument = hrDocument;
            }, error => {
            });
        }
    }

    ionViewCanLeave() {
        return this.hrDocumentCreate.confirmCancel();
    }

    loadingIsOver() {
        return this.hrDocument && this.hrDocument !== undefined;
    }
}
