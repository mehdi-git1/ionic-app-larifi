import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { ProfessionalInterviewModel } from '../../models/professional-assessment/professional-assessment.model';
import { OnlineProfessionalInterviewService } from './online-professional-assessment.service';
import { OfflineProfessionalAssessementService } from './offline-professional-assessment.service';



@Injectable()
export class ProfessionalInterviewService extends BaseService {

    constructor(
        protected connectivityService: ConnectivityService,
        private onlineProfessionalInterviewService: OnlineProfessionalInterviewService,
        private offlineProfessionalAssessementService: OfflineProfessionalAssessementService
    ) {
        super(
            connectivityService,
            onlineProfessionalInterviewService,
            offlineProfessionalAssessementService
        );

    }

    /**
     * Récupère les bilans professionel d'un PNC (sur 3 ans ou trois derniéres)
     * @param matricule le matricule du PNC
     * @return une promesse contenant les EObservations trouvées
     */
    getProfessionalInterviews(matricule: string): Promise<ProfessionalInterviewModel[]> {
        return this.execFunctionService('getProfessionalInterviews', matricule);
    }

}
