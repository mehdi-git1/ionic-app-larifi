import { EntityEnum } from './../../enums/entity.enum';
import { StorageService } from './../../storage/storage.service';
import { Injectable } from '@angular/core';
import { RestService } from '../../http/rest/rest.base.service';
import { UrlConfiguration } from '../../configuration/url.configuration';

import { ProfessionalInterviewModel } from '../../models/professional-interview/professional-interview.model';
import { TransformerService } from '../transformer/transformer.service';

@Injectable()
export class OnlineProfessionalInterviewService {

    constructor(
        public restService: RestService,
        public config: UrlConfiguration,
        public universalTransformer: TransformerService,
        private storageService: StorageService
    ) { }

    /**
     * Récupère les bilans professionels d'un PNC à partir du back
     * @param matricule le matricule du PNC
     * @return une promesse contenant les bilans professionels trouvées
     */
    getProfessionalInterviews(matricule: string): Promise<ProfessionalInterviewModel[]> {
        return this.restService.get(this.config.getBackEndUrl('getProfessionalInterviewsByMatricule', [matricule])).then(
            professionalInterviews => {
                return this.universalTransformer.universalTransformObjectArray(ProfessionalInterviewModel, professionalInterviews);
            }
        );
    }

    /**
     * Supprime un bilan professionnel
     * @param id l'id du bilan professionnel à supprimer
     * @return une promesse disant que la suppression s'est bien passée, ou pas
     */
    delete(id: number): Promise<any> {
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
