

import { Component } from '@angular/core';

import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { PncModel } from '../../../../core/models/pnc.model';

@Component({
    selector: 'hr-document-create',
    templateUrl: 'hr-document-create.page.html',
})
export class HrDocumentCreatePage {

    pnc: PncModel;

    HrDocumentModeEnum = HrDocumentModeEnum;

    constructor() {
    }

    loadingIsOver() {
        return true;
    }
}
