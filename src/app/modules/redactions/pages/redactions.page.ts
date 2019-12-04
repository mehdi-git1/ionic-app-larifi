import { ProfessionalInterviewDisplayModeEnum } from './../../../core/enums/professional-interview/professional-interview-display-mode.enum';
import { CareerObjectiveDisplayModeEnum } from './../../../core/enums/career-objective/career-objective-display-mode.enum';
import { EObservationDisplayModeEnum } from './../../../core/enums/eobservation/eobservation-display-mode.enum';
import { ProfessionalInterviewModel } from './../../../core/models/professional-interview/professional-interview.model';
import { ProfessionalInterviewService } from './../../../core/services/professional-interview/professional-interview.service';
import { CareerObjectiveModel } from './../../../core/models/career-objective.model';
import { CareerObjectiveService } from './../../../core/services/career-objective/career-objective.service';
import { EObservationModel } from './../../../core/models/eobservation/eobservation.model';
import { EObservationService } from './../../../core/services/eobservation/eobservation.service';
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
    eObservations: EObservationModel[];
    careerObjectives: CareerObjectiveModel[];
    professionalInterviews: ProfessionalInterviewModel[];
    EObservationDisplayModeEnum = EObservationDisplayModeEnum;
    CareerObjectiveDisplayModeEnum = CareerObjectiveDisplayModeEnum;
    ProfessionalInterviewDisplayModeEnum = ProfessionalInterviewDisplayModeEnum;

    constructor(private sessionService: SessionService,
                private activatedRoute: ActivatedRoute,
                private pncService: PncService,
                private htmlService: HtmlService,
                private eObservationService: EObservationService,
                private careerObjectiveService: CareerObjectiveService,
                private professionalInterviewService: ProfessionalInterviewService) {
        this.eformsWrittenUrl = this.sessionService.getActiveUser().appInitData.eformsWrittenUrl;
        this.cabinReportsWrittenUrl = this.sessionService.getActiveUser().appInitData.cabinReportsWrittenUrl;
    }

    ionViewDidEnter() {
        const matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
        this.pncService.getPnc(matricule).then(pnc => {
            this.pnc = pnc;
        }, error => { });

        this.eObservationService.findEObservationsByRedactor(matricule).then(eObservations => {
            this.eObservations = eObservations;
        });

        this.careerObjectiveService.findCareerObjectivesByRedactor(matricule).then(careerObjectives => {
            this.careerObjectives = careerObjectives;
        });

        this.professionalInterviewService.findProfessionalInterviewsByRedactor(matricule).then(professionalInterviews => {
            this.professionalInterviews = professionalInterviews;
        });
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
    iAmManager() {
        return this.sessionService.getActiveUser().isManager;

    }

    isMyHome() {
        return this.pnc && this.sessionService.isActiveUserMatricule(this.pnc.matricule);
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.careerObjectives !== undefined && this.pnc !== undefined
        && this.eObservations !== undefined && this.professionalInterviews !== undefined;
    }
}
