import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { ProfessionalAssessmentModel } from '../../models/professional-assessment/professional-assessment.model';
import { OnlineProfessionalAssessmentService } from './online-professional-assessment.service';
import { OfflineProfessionalAssessementService } from './offline-professional-assessment.service';



@Injectable()
export class ProfessionalAssessmentService extends BaseService {

    constructor(
        protected connectivityService: ConnectivityService,
        private onlineProfessionalAssessmentService: OnlineProfessionalAssessmentService,
        private offlineProfessionalAssessementService: OfflineProfessionalAssessementService
    ) {
        super(
            connectivityService,
            onlineProfessionalAssessmentService,
            offlineProfessionalAssessementService
        );

    }

    /**
     * Récupère les bilans professionel d'un PNC (sur 3 ans ou trois derniéres)
     * @param matricule le matricule du PNC
     * @return une promesse contenant les EObservations trouvées
     */
    getProfessionalAssessments(matricule: string): Promise<ProfessionalAssessmentModel[]> {
        return this.execFunctionService('getProfessionalAssessments', matricule);
    }

}
