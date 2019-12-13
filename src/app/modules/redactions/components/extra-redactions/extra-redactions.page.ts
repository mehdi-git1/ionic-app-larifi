import { PncModel } from 'src/app/core/models/pnc.model';

import { Component, Input } from '@angular/core';

import { EFormsFormTypeEnum } from '../../../../core/enums/e-forms/e-forms-form-type.enum';
import { HtmlService } from '../../../../core/file/html/html.service';
import { EFormsUrlParamsModel } from '../../../../core/models/e-forms/e-forms-url-params.model';
import { SessionService } from '../../../../core/services/session/session.service';
import { DateTransform } from '../../../../shared/utils/date-transform';

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
        private htmlService: HtmlService,
        private dateTransform: DateTransform) {
        this.eformsWrittenUrl = this.sessionService.getActiveUser().appInitData.eformsWrittenUrl;
        this.cabinReportsWrittenUrl = this.sessionService.getActiveUser().appInitData.cabinReportsWrittenUrl;
    }

    ionViewDidEnter() {
    }

    /**
     * Ouvre un onglet avec l'url en paramètre
     * @param url url
     */
    goToLink(url) {
        let parameterizedUrl = url.replace('%MATRICULE%', this.pnc ? this.pnc.matricule : '');

        const matriculeBase64 = btoa(this.pnc ? this.pnc.matricule : '');
        parameterizedUrl = parameterizedUrl.replace('%MATRICULE_BASE64%', matriculeBase64);

        const eformsParams = new EFormsUrlParamsModel();
        eformsParams.matriculePnProprietaireOuRedacteur = this.pnc ? this.pnc.matricule : '';
        eformsParams.typesFormulaires = [EFormsFormTypeEnum.RDV, EFormsFormTypeEnum.CRIP,
        EFormsFormTypeEnum.CRAT, EFormsFormTypeEnum.CSR, EFormsFormTypeEnum.RDS_PNC];
        eformsParams.typesFormulairesAvecPdf = [EFormsFormTypeEnum.RDV, EFormsFormTypeEnum.CRIP,
        EFormsFormTypeEnum.CRAT];
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
