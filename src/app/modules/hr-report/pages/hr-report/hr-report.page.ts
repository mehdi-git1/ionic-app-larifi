import { TabHeaderEnum } from './../../../../core/enums/tab-header.enum';
import { PncModel } from './../../../../core/models/pnc.model';
import { SessionService } from './../../../../core/services/session/session.service';
import { Component } from '@angular/core';

@Component({
    selector: 'hr-report',
    templateUrl: 'hr-report.page.html',
})
export class HrReportPage {

    pnc: PncModel;
    TabHeaderEnum = TabHeaderEnum;
    constructor(private sessionService: SessionService) {
    }

    ionViewWillEnter() {
        if (this.sessionService.visitedPnc) {
            this.pnc = this.sessionService.visitedPnc;
        } else {
            this.pnc = this.sessionService.getActiveUser().authenticatedPnc;
        }
    }

    createNewDocument() {

    }

    canCreateDocument() {
        return true;
    }

    loadingIsOver() {
        return true;
    }
}
