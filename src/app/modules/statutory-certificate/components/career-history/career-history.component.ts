

import { HtmlService } from 'src/app/core/file/html/html.service';
import { AppParameterModel } from 'src/app/core/models/app-parameter.model';
import { SessionService } from 'src/app/core/services/session/session.service';

import { Component, OnInit } from '@angular/core';

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
        private htmlService: HtmlService) {
    }

    ngOnInit() {
        this.careerHistoryLinks = this.sessionService.getActiveUser().appInitData.careerHistoryLinks;
        this.matricule = this.sessionService.visitedPnc.matricule;
    }

    goToLink(link: string) {
        if (link) {
            this.htmlService.displayHTML(link.replace('%MATRICULE%', this.matricule));
        }
    }

}
