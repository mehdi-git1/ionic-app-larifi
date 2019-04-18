import { ProfessionalInterviewItemModel } from './professional-interview-item.model';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';

export class ProfessionalInterviewThemeModel extends EDossierPncObjectModel {

    id: number;
    label: string;
    themeOrder: number;
    professionalInterviewItems: ProfessionalInterviewItemModel[];
    subTheme: ProfessionalInterviewThemeModel[];

    getStorageId(): string {
        return `${this.techId}`;
    }
}
