

import { AppParameterModel } from 'src/app/core/models/app-parameter.model';
import { SecurityService } from 'src/app/core/services/security/security.service';
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
        private securityservice: SecurityService) {
    }

    ngOnInit() {
        this.careerHistoryLinks = this.sessionService.getActiveUser().appInitData.carrerHistoryLinks;
        this.matricule = this.sessionService.visitedPnc.matricule;
    }

    goToLink(link: string) {
        if (link) {
            window.open(link.replace('%MATRICULE%', this.matricule), '_blank');
        }
    }

}
