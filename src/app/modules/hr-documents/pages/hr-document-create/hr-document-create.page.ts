

import { NavParams } from 'ionic-angular';

import { Component, OnInit } from '@angular/core';

import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { PncModel } from '../../../../core/models/pnc.model';

@Component({
    selector: 'hr-document-create',
    templateUrl: 'hr-document-create.page.html',
})
export class HrDocumentCreatePage implements OnInit {

    pnc: PncModel;
    mode: HrDocumentModeEnum;

    HrDocumentModeEnum = HrDocumentModeEnum;

    constructor(private navParams: NavParams) {
    }

    ngOnInit() {
        this.mode = this.navParams.get('mode');
    }

    loadingIsOver() {
        return true;
    }
}
