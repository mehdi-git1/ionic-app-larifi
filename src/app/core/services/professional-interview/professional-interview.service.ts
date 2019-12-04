import { Injectable } from '@angular/core';

import { PncLightModel } from '../../models/pnc-light.model';
import {
    ProfessionalInterviewModel
} from '../../models/professional-interview/professional-interview.model';
import { BaseService } from '../base/base.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { SessionService } from '../session/session.service';
import { OfflineProfessionalInterviewService } from './offline-professional-interview.service';
import { OnlineProfessionalInterviewService } from './online-professional-interview.service';

@Injectable({ providedIn: 'root' })
export class ProfessionalInterviewService extends BaseService {

    constructor(
        protected connectivityService: ConnectivityService,
        private onlineProfessionalInterviewService: OnlineProfessionalInterviewService,
        private offlineProfessionalInterviewService: OfflineProfessionalInterviewService,
        private sessionService: SessionService
    ) {
        super(
            connectivityService,
            onlineProfessionalInterviewService,
            offlineProfessionalInterviewService
        );

    }

    /**
     * Récupère les bilans professionnels d'un PNC
     * @param matricule le matricule du PNC
     * @return une promesse contenant les bilans professionnels trouvés
     */
    public getProfessionalInterviews(matricule: string): Promise<ProfessionalInterviewModel[]> {
        return this.execFunctionService('getProfessionalInterviews', matricule);
    }

    /**
     * Récupère un bilan professionnel à partir de son id
     * @param id l'id du bilan professionnel à récupérer
     * @return une promesse contenant le bilan professionnel récupéré
     */
    public getProfessionalInterview(id: number): Promise<ProfessionalInterviewModel> {
        return this.execFunctionService('getProfessionalInterview', id);
    }

    /**
     * Créé ou met à jour un bilan professionnel
     * @param  profesionnalInterview le bilan professionnel à créer ou mettre à jour
     * @return une promesse contenant le bilan professionnel créé ou mis à jour
     */
    public createOrUpdate(professionalInterview: ProfessionalInterviewModel): Promise<ProfessionalInterviewModel> {
        if (professionalInterview.techId === undefined) {
            professionalInterview.redactionDate = new Date();
            professionalInterview.instructor = new PncLightModel();
            professionalInterview.instructor.matricule = this.sessionService.getActiveUser().matricule;
            professionalInterview.instructor.lastName = this.sessionService.getActiveUser().lastName;
            professionalInterview.instructor.firstName = this.sessionService.getActiveUser().firstName;
        }
        professionalInterview.lastUpdateAuthor = new PncLightModel();
        professionalInterview.lastUpdateAuthor.matricule = this.sessionService.getActiveUser().matricule;
        professionalInterview.lastUpdateAuthor.lastName = this.sessionService.getActiveUser().lastName.toUpperCase();
        professionalInterview.lastUpdateAuthor.firstName = this.sessionService.getActiveUser().firstName;
        professionalInterview.lastUpdateDate = new Date();

        return this.execFunctionService('createOrUpdate', professionalInterview);
    }

    /**
     * Supprime un bilan professionnel
     * @param id l'id du bilan professionnel à supprimer
     * @return une promesse disant que la suppression s'est bien passée, ou pas
     */
    public delete(id: number): Promise<any> {
        return this.execFunctionService('delete', id);
    }

    /**
     * Récupère les bilans professionnels rédigés
     * @param matricule le matricule du rédacteur
     * @return une promesse contenant les bilans professionnels rédigés
     */
    public findProfessionalInterviewsByRedactor(matricule: string): Promise<ProfessionalInterviewModel[]> {
        return this.onlineProfessionalInterviewService.findProfessionalInterviewsByRedactor(matricule);
    }
}
