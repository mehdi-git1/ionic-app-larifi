import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { OnlineProfessionalInterviewService } from './online-professional-interview.service';
import { OfflineProfessionalInterviewService } from './offline-professional-interview.service';
import { ProfessionalInterviewModel } from '../../models/professional-interview/professional-interview.model';



@Injectable()
export class ProfessionalInterviewService extends BaseService {

    constructor(
        protected connectivityService: ConnectivityService,
        private onlineProfessionalInterviewService: OnlineProfessionalInterviewService,
        private offlineProfessionalInterviewService: OfflineProfessionalInterviewService
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

}
