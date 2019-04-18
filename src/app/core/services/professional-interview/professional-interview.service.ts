import { PncLightModel } from './../../models/pnc-light.model';
import { PncModel } from './../../models/pnc.model';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { OnlineProfessionalInterviewService } from './online-professional-interview.service';
import { OfflineProfessionalInterviewService } from './offline-professional-interview.service';
import { ProfessionalInterviewModel } from '../../models/professional-interview/professional-interview.model';
import { DateTransform } from '../../../shared/utils/date-transform';
import { SessionService } from '../session/session.service';


@Injectable()
export class ProfessionalInterviewService extends BaseService {

    constructor(
        protected connectivityService: ConnectivityService,
        private onlineProfessionalInterviewService: OnlineProfessionalInterviewService,
        private offlineProfessionalInterviewService: OfflineProfessionalInterviewService,
        private dateTransformer: DateTransform,
        private sessionService: SessionService
    ) {
        super(
            connectivityService,
            onlineProfessionalInterviewService,
            offlineProfessionalInterviewService
        );

    }

    /**
     * Récupère les bilans professionels d'un PNC
     * @param matricule le matricule du PNC
     * @return une promesse contenant les bilans professionels trouvés
     */
    getProfessionalInterviews(matricule: string): Promise<ProfessionalInterviewModel[]> {
        return this.execFunctionService('getProfessionalInterviews', matricule);
    }

    /**
     * Créé ou met à jour un bilan professionnel
     * @param  profesionnalInterview le bilan professionnel à créer ou mettre à jour
     * @return une promesse contenant le bilan professionnel créé ou mis à jour
     */
    createOrUpdate(profesionnalInterview: ProfessionalInterviewModel): Promise<ProfessionalInterviewModel> {
        if (profesionnalInterview.techId === undefined) {
            profesionnalInterview.redactionDate = new Date();
            profesionnalInterview.instructor = new PncLightModel();
            profesionnalInterview.instructor.matricule = this.sessionService.getActiveUser().matricule;
        }
        profesionnalInterview.lastUpdateDate = new Date();

        return this.execFunctionService('createOrUpdate', profesionnalInterview);
    }
}
