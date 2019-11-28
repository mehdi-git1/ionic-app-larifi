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

    constructor(private sessionService: SessionService, private htmlService: HtmlService) {
        this.eformsWrittenUrl = this.sessionService.getActiveUser().appInitData.eformsWrittenUrl;
        this.cabinReportsWrittenUrl = this.sessionService.getActiveUser().appInitData.cabinReportsWrittenUrl;
    }
    /**
     * Ouvre un onglet avec l'url en paramètre
     * @param url url
     */
    goToLink(url) {
        this.htmlService.displayHTML(url);
    }
}
