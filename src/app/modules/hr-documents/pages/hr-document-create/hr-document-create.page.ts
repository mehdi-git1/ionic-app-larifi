

import { AlertController, NavParams } from 'ionic-angular';

import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { PncModel } from '../../../../core/models/pnc.model';
import { HrDocumentComponent } from '../../components/hr-document/hr-document.component';

@Component({
    selector: 'hr-document-create',
    templateUrl: 'hr-document-create.page.html',
})
export class HrDocumentCreatePage implements OnInit {

    pnc: PncModel;
    mode: HrDocumentModeEnum;

    HrDocumentModeEnum = HrDocumentModeEnum;

    @ViewChild('hrDocumentCreate') hrDocumentCreate: HrDocumentComponent;

    constructor(private navParams: NavParams,
        private translateService: TranslateService,
        private alertCtrl: AlertController) {
    }

    ngOnInit() {
        this.mode = this.navParams.get('mode');
    }

    ionViewCanLeave() {
        return this.hrDocumentCreate.confirmCancel();
    }

    loadingIsOver() {
        return true;
    }
}
