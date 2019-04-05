import { PncModel } from './../pnc.model';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { InterviewStateEnum } from '../../enums/professional-interview/interview-state.enum';
import { InterviewTypeEnum } from '../../enums/professional-interview/interview-type.enum';

export class ProfessionalInterviewModel extends EDossierPncObjectModel {

    pnc: PncModel;
    annualProfessionalInterview: Date;
    type: InterviewTypeEnum;
    state: InterviewStateEnum;
    redactor: PncModel;
    redactionDate: Date;
    pncDivision: string;
    pncGinq: string;
    pncSector: string;
    pncSpeciality: string;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
