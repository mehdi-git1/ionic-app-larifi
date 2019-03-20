import { ProfessionalAssessmentStateEnum } from './../../enums/professional-assessment/professional-assessment-state.enum';
import { Injectable } from '@angular/core';
import { RestService } from '../../http/rest/rest.base.service';
import { UrlConfiguration } from '../../configuration/url.configuration';

import { ProfessionalAssessmentModel } from '../../models/professional-assessment/professional-assessment.model';
import { TransformerService } from '../transformer/transformer.service';
import { InterviewTypeEnum } from '../../enums/professional-assessment/interview-type.enum';



@Injectable()
export class OnlineProfessionalAssessmentService {

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
    getProfessionalAssessments(matricule: string): Promise<ProfessionalAssessmentModel[]> {
        const tmpArray = [new ProfessionalAssessmentModel(), new ProfessionalAssessmentModel()];
        tmpArray[0].state = ProfessionalAssessmentStateEnum.A;
        tmpArray[0].interviewType = InterviewTypeEnum.RA;
        tmpArray[0].interviewDate = new Date();
        tmpArray[1].state = ProfessionalAssessmentStateEnum.A;
        tmpArray[1].interviewType = InterviewTypeEnum.RA;
        tmpArray[1].interviewDate = new Date();
        this.universalTransformer.universalTransformObjectArray(ProfessionalAssessmentModel, tmpArray);
        return this.restService.get(this.config.getBackEndUrl('getProfessionalAssessmentsByMatricule', [matricule])).then(
            professionalAssessments => {
                return this.universalTransformer.universalTransformObjectArray(ProfessionalAssessmentModel, professionalAssessments);
            }
        );
    }

}
