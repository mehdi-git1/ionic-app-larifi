import { HtmlService } from 'src/app/core/file/html/html.service';
import { AppParameterModel } from 'src/app/core/models/app-parameter.model';
import { SessionService } from 'src/app/core/services/session/session.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EFormsFormTypeEnum } from '../../../../core/enums/e-forms/e-forms-form-type.enum';
import { EFormsUrlParamsModel } from '../../../../core/models/e-forms/e-forms-url-params.model';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { DateTransform } from '../../../../shared/utils/date-transform';

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
        private dateTransform: DateTransform,
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

            const eformsParams = new EFormsUrlParamsModel();
            eformsParams.matriculePnConcerne = this.matricule;
            eformsParams.typesFormulaires = [EFormsFormTypeEnum.CRAT, EFormsFormTypeEnum.RDV];
            eformsParams.typesFormulairesAvecPdf = [EFormsFormTypeEnum.CRAT, EFormsFormTypeEnum.RDV];
            const now = new Date();
            const now2YearsBefore = new Date();
            now2YearsBefore.setUTCFullYear(now2YearsBefore.getUTCFullYear() - 2);
            eformsParams.dateDebut = this.dateTransform.formatDateInDay(now2YearsBefore, 'ddMMyyyy');
            eformsParams.dateFin = this.dateTransform.formatDateInDay(now, 'ddMMyyyy');
            const eformsParamsBase64 = btoa(JSON.stringify(eformsParams));
            parameterizedUrl = parameterizedUrl.replace('%EFORMS_PARAMS_BASE64%', eformsParamsBase64);

            this.htmlService.displayHTML(parameterizedUrl);
        }
    }

}
