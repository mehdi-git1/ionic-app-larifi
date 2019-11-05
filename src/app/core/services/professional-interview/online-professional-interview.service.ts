import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import { EntityEnum } from '../../enums/entity.enum';
import { RestService } from '../../http/rest/rest.base.service';
import {
    ProfessionalInterviewModel
} from '../../models/professional-interview/professional-interview.model';
import { StorageService } from '../../storage/storage.service';
import { TransformerService } from '../transformer/transformer.service';

@Injectable({ providedIn: 'root' })
export class OnlineProfessionalInterviewService {

    constructor(
        public restService: RestService,
        public config: UrlConfiguration,
        public universalTransformer: TransformerService,
        private storageService: StorageService
    ) { }

    /**
     * Récupère les bilans professionnels d'un PNC à partir du back
     * @param matricule le matricule du PNC
     * @return une promesse contenant les bilans professionnels trouvées
     */
    public getProfessionalInterviews(matricule: string): Promise<ProfessionalInterviewModel[]> {
        return this.restService.get(this.config.getBackEndUrl('getProfessionalInterviewsByMatricule', [matricule])).then(
            professionalInterviews => {
                return this.universalTransformer.universalTransformObjectArray(ProfessionalInterviewModel, professionalInterviews);
            }
        );
    }

    /**
     * Récupère un bilan professionnel à partir de son id
     * @param id l'id du bilan professionnel à récupérer
     * @return une promesse contenant le bilan professionnel récupéré
     */
    public getProfessionalInterview(id: number): Promise<ProfessionalInterviewModel> {
        return this.restService.get(this.config.getBackEndUrl('getProfessionalInterviewById', [id]));
    }

    /**
     * Créé ou met à jour un bilan professionnel
     * @param  profesionnalInterview le bilan professionnel à créer ou mettre à jour
     * @return une promesse contenant le bilan professionnel créé ou mis à jour
     */
    public createOrUpdate(professionalInterview: ProfessionalInterviewModel): Promise<ProfessionalInterviewModel> {
        this.storageService.saveAsync(EntityEnum.PROFESSIONAL_INTERVIEW, professionalInterview, true);
        this.storageService.persistOfflineMap();
        return this.restService.post(this.config.getBackEndUrl('professionalInterviews'), professionalInterview);
    }

    /**
     * Supprime un bilan professionnel
     * @param id l'id du bilan professionnel à supprimer
     * @return une promesse disant que la suppression s'est bien passée, ou pas
     */
    public delete(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.storageService.delete(EntityEnum.PROFESSIONAL_INTERVIEW, `${id}`);
            this.storageService.persistOfflineMap();
            this.restService.delete(this.config.getBackEndUrl('deleteProfessionalInterviewById', [id])).then(() => {
                resolve();
            }).catch(() => {
                reject();
            });
        });
    }
}
