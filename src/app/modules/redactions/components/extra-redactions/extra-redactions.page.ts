import { PncModel } from 'src/app/core/models/pnc.model';

import { Component, Input } from '@angular/core';

import { HtmlService } from '../../../../core/file/html/html.service';
import { SessionService } from '../../../../core/services/session/session.service';

@Component({
    selector: 'extra-redactions',
    templateUrl: 'extra-redactions.page.html',
    styleUrls: ['./extra-redactions.page.scss']
})
export class ExtraRedactionsComponent {

    eformsWrittenUrl: string;
    cabinReportsWrittenUrl: string;
    @Input() pnc: PncModel;

    constructor(
        private sessionService: SessionService,
        private htmlService: HtmlService
    ) {
        this.cabinReportsWrittenUrl = this.sessionService.getActiveUser().appInitData.cabinReportsWrittenUrl;
    }

    /**
     * Ouvre un onglet avec l'url en paramètre
     * @param url url
     */
    goToLink(url) {
        let parameterizedUrl = url.replace('%MATRICULE%', this.pnc ? this.pnc.matricule : '');

        const matriculeBase64 = btoa(this.pnc ? this.pnc.matricule : '');
        parameterizedUrl = parameterizedUrl.replace('%MATRICULE_BASE64%', matriculeBase64);

        const now2YearsBefore = new Date();
        now2YearsBefore.setUTCFullYear(now2YearsBefore.getUTCFullYear() - 2);

        this.htmlService.displayHTML(parameterizedUrl);
    }
}
