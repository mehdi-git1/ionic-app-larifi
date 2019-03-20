import { InterviewStateEnum } from '../../enums/professional-interview/interview-state.enum';
import { Injectable } from '@angular/core';
import { RestService } from '../../http/rest/rest.base.service';
import { UrlConfiguration } from '../../configuration/url.configuration';

import { ProfessionalInterviewModel } from '../../models/professional-interview/professional-interview.model';
import { TransformerService } from '../transformer/transformer.service';
import { InterviewTypeEnum } from '../../enums/professional-interview/interview-type.enum';



@Injectable()
export class OnlineProfessionalInterviewService {

    constructor(
        public restService: RestService,
        public config: UrlConfiguration,
        public universalTransformer: TransformerService
    ) { }

    /**
     * Récupère les bilans professionel d'un PNC à partir du back
     * @param matricule le matricule du PNC
     * @return une promesse contenant les bilans professionel trouvées
     */
    getProfessionalInterviews(matricule: string): Promise<ProfessionalInterviewModel[]> {
        const tmpArray = [new ProfessionalInterviewModel(), new ProfessionalInterviewModel()];
        tmpArray[0].state = InterviewStateEnum.A;
        tmpArray[0].interviewType = InterviewTypeEnum.RA;
        tmpArray[0].interviewDate = new Date();
        tmpArray[1].state = InterviewStateEnum.A;
        tmpArray[1].interviewType = InterviewTypeEnum.RA;
        tmpArray[1].interviewDate = new Date();
        this.universalTransformer.universalTransformObjectArray(ProfessionalInterviewModel, tmpArray);
        return this.restService.get(this.config.getBackEndUrl('getProfessionalInterviewsByMatricule', [matricule])).then(
            professionalInterviews => {
                return this.universalTransformer.universalTransformObjectArray(ProfessionalInterviewModel, professionalInterviews);
            }
        );
    }

}
