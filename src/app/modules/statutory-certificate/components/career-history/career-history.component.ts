import { HtmlService } from 'src/app/core/file/html/html.service';
import { AppParameterModel } from 'src/app/core/models/app-parameter.model';
import { SessionService } from 'src/app/core/services/session/session.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PncService } from '../../../../core/services/pnc/pnc.service';

@Component({
    selector: 'career-history',
    templateUrl: 'career-history.component.html',
    styleUrls: ['./career-history.component.scss']
})
export class CareerHistoryComponent implements OnInit {

    careerHistoryLinks: Array<AppParameterModel>;

    matricule: string;

    constructor(
        private sessionService: SessionService,
        private htmlService: HtmlService,
        private pncService: PncService,
        private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.careerHistoryLinks = this.sessionService.getActiveUser().appInitData.careerHistoryLinks;
        this.matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
    }

    goToLink(link: string) {
        if (link) {
            let parameterizedUrl = link.replace('%MATRICULE%', this.matricule);

            const matriculeBase64 = btoa(this.matricule);
            parameterizedUrl = parameterizedUrl.replace('%MATRICULE_BASE64%', matriculeBase64);

            const now2YearsBefore = new Date();
            now2YearsBefore.setUTCFullYear(now2YearsBefore.getUTCFullYear() - 2);

            this.htmlService.displayHTML(parameterizedUrl);
        }
    }

}
