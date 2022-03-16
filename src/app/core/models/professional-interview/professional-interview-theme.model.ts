import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { ProfessionalInterviewItemModel } from './professional-interview-item.model';

export class ProfessionalInterviewThemeModel extends EDossierPncObjectModel {

    id: number;
    label: string;
    themeOrder: number;
    key: string;
    professionalInterviewItems: ProfessionalInterviewItemModel[];
    subThemes: ProfessionalInterviewThemeModel[];

    getStorageId(): string {
        return `${this.techId}`;
    }
}
