import { PncModel } from './../pnc.model';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { ProfessionalAssessmentStateEnum } from '../../enums/professional-assessment/professional-assessment-state.enum';
import { InterviewTypeEnum } from '../../enums/professional-assessment/interview-type.enum';

export class ProfessionalAssessmentModel extends EDossierPncObjectModel {

    pnc: PncModel;
    interviewDate: Date;
    interviewType: InterviewTypeEnum;
    state: ProfessionalAssessmentStateEnum;
    redactor: PncModel;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
