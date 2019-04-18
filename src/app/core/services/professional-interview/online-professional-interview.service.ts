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
        public universalTransformer: TransformerService
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
     * Créé ou met à jour un bilan professionnel
     * @param  profesionnalInterview le bilan professionnel à créer ou mettre à jour
     * @return une promesse contenant le bilan professionnel créé ou mis à jour
     */
    createOrUpdate(professionalInterview: ProfessionalInterviewModel): Promise<ProfessionalInterviewModel> {
    return this.restService.post(this.config.getBackEndUrl('professionalInterviews'), professionalInterview);
    }
}
