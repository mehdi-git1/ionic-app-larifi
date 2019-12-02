import { PncService } from './../../../core/services/pnc/pnc.service';
import { PncModel } from './../../../core/models/pnc.model';
import { HtmlService } from './../../../core/file/html/html.service';
import { SessionService } from './../../../core/services/session/session.service';
import { TabHeaderEnum } from 'src/app/core/enums/tab-header.enum';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
    pnc: PncModel;

    constructor(private sessionService: SessionService,
                private activatedRoute: ActivatedRoute,
                private pncService: PncService,
                private htmlService: HtmlService) {
        this.eformsWrittenUrl = this.sessionService.getActiveUser().appInitData.eformsWrittenUrl;
        this.cabinReportsWrittenUrl = this.sessionService.getActiveUser().appInitData.cabinReportsWrittenUrl;
    }

    ionViewDidEnter() {
        const matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
        this.pncService.getPnc(matricule).then(pnc => {
            this.pnc = pnc;
        }, error => { });
    }

    /**
     * Ouvre un onglet avec l'url en paramètre
     * @param url url
     */
    goToLink(url) {
        const parameterizedUrl = url.replace('%MATRICULE%', this.pnc ? this.pnc.matricule : '');
        this.htmlService.displayHTML(parameterizedUrl);
    }

    /**
     * Vérifie le PNC consulté est manager
     */
    pncIsManager() {
        return this.pnc && this.pnc.manager;
    }

    isMyHome() {
        return this.pnc && this.sessionService.isActiveUserMatricule(this.pnc.matricule);
    }

}
