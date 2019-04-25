import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { ProfessionalInterviewStateEnum } from '../../enums/professional-interview/professional-interview-state.enum';
import { ProfessionalInterviewTypeEnum } from '../../enums/professional-interview/professional-interview-type.enum';
import { PncLightModel } from '../pnc-light.model';
import { ProfessionalInterviewThemeModel } from './professional-interview-theme.model';

export class ProfessionalInterviewModel extends EDossierPncObjectModel {

    matricule: string;
    annualProfessionalInterviewDate: string;
    type: ProfessionalInterviewTypeEnum;
    state: ProfessionalInterviewStateEnum;
    redactionDate: Date;
    pncAtInterviewDate: PncLightModel;
    instructor: PncLightModel;
    lastUpdateDate: Date;
    instructorValidationDate: Date;
    pncSignatureDate: Date;
    professionalInterviewThemes: ProfessionalInterviewThemeModel[];

    getStorageId(): string {
        return `${this.techId}`;
    }

}
