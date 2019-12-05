import { DocumentModel } from './../document.model';
import { PncModel } from './../pnc.model';
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
    lastUpdateAuthor: PncLightModel;
    instructorValidationDate: Date;
    pncSignatureDate: Date;
    professionalInterviewThemes: ProfessionalInterviewThemeModel[];
    pncComment: string;
    pncAcknowledgement: boolean;
    friendlyId: number;
    fromDate: Date;
    toDate: Date;
    signingBlock: boolean;
    documents: Array<DocumentModel> = new Array();

    getStorageId(): string {
        return `${this.techId}`;
    }

}
