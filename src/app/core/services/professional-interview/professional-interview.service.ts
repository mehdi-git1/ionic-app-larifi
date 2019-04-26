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
    createOrUpdate(professionalInterview: ProfessionalInterviewModel): Promise<ProfessionalInterviewModel> {
        if (professionalInterview.techId === undefined) {
            professionalInterview.redactionDate = new Date();
            professionalInterview.instructor = new PncLightModel();
            professionalInterview.instructor.matricule = this.sessionService.getActiveUser().matricule;
        }
        professionalInterview.lastUpdateDate = new Date();

        return this.execFunctionService('createOrUpdate', professionalInterview);
    }

    /**
     * Supprime un bilan professionnel
     * @param id l'id du bilan professionnel à supprimer
     * @return une promesse disant que la suppression s'est bien passée, ou pas
     */
    delete(id: number): Promise<any> {
        return this.execFunctionService('delete', id);
    }

}
