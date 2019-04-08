import { PncModel } from './../pnc.model';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { ProfessionalInterviewStateEnum } from '../../enums/professional-interview/professional-interview-state.enum';
import { ProfessionalInterviewTypeEnum } from '../../enums/professional-interview/professional-interview-type.enum';

export class ProfessionalInterviewModel extends EDossierPncObjectModel {

    matricule: string;
    annualProfessionalInterview: Date;
    type: ProfessionalInterviewTypeEnum;
    state: ProfessionalInterviewStateEnum;
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
