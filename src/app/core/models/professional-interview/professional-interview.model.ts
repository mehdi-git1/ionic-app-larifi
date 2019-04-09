import { PncModel } from './../pnc.model';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { ProfessionalInterviewStateEnum } from '../../enums/professional-interview/professional-interview-state.enum';
import { ProfessionalInterviewTypeEnum } from '../../enums/professional-interview/professional-interview-type.enum';

export class ProfessionalInterviewModel extends EDossierPncObjectModel {

    pnc: PncModel;
    annualProfessionalInterviewDate: Date;
    type: ProfessionalInterviewTypeEnum;
    state: ProfessionalInterviewStateEnum;
    instructor: PncModel;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
