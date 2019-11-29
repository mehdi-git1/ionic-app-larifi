import { PncModel } from './../../../core/models/pnc.model';
import { HtmlService } from './../../../core/file/html/html.service';
import { SessionService } from './../../../core/services/session/session.service';
import { TabHeaderEnum } from 'src/app/core/enums/tab-header.enum';
import { Component } from '@angular/core';

@Component({
    selector: 'page-redactions',
    templateUrl: 'redactions.page.html',
    styleUrls: ['./redactions.page.scss']
})
export class RedactionsPage {

    TabHeaderEnum = TabHeaderEnum;
    eformsWrittenUrl: string;
    cabinReportsWrittenUrl: string;
    matricule: string;

    constructor(private sessionService: SessionService, private htmlService: HtmlService) {
        this.matricule = this.sessionService.visitedPnc.matricule;
        this.eformsWrittenUrl = this.sessionService.getActiveUser().appInitData.eformsWrittenUrl;
        this.cabinReportsWrittenUrl = this.sessionService.getActiveUser().appInitData.cabinReportsWrittenUrl;
    }
    /**
     * Ouvre un onglet avec l'url en paramètre
     * @param url url
     */
    goToLink(url) {
        const parameterizedUrl = url.replace('%MATRICULE%', this.matricule);
        this.htmlService.displayHTML(parameterizedUrl);
    }

    pncIsManager() {
        return this.sessionService.visitedPnc.manager ;
    }
}
