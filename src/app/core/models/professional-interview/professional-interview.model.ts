import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { ProfessionalInterviewStateEnum } from '../../enums/professional-interview/professional-interview-state.enum';
import { ProfessionalInterviewTypeEnum } from '../../enums/professional-interview/professional-interview-type.enum';
import { PncLightModel } from '../pnc-light.model';
import { ProfessionalInterviewThemeModel } from './professional-interview-theme.model';

export class ProfessionalInterviewModel extends EDossierPncObjectModel {

    matricule: string;
    annualProfessionalInterview: Date;
    type: ProfessionalInterviewTypeEnum;
    state: ProfessionalInterviewStateEnum;
    redactionDate: Date;
    pncDivision: string;
    pncGinq: string;
    pncSector: string;
    pncSpeciality: string;
    instructor: PncLightModel;
    professionalInterviewThemes: ProfessionalInterviewThemeModel[];

    getStorageId(): string {
        return `${this.techId}`;
    }
}
