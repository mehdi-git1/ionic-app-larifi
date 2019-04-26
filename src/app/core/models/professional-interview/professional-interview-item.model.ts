import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';

export class ProfessionalInterviewItemModel extends EDossierPncObjectModel {

    id: number;
    itemOrder: number;
    key: string;
    label: string;
    value: string;
    referentialItemId: number;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
