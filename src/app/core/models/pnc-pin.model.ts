import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';

export class PncPinModel extends EDossierPncObjectModel {
    matricule: string;
    pinCode: number;
    secretQuestion: string;
    secretAnswer: string;

    getStorageId(): string {
        return this.matricule;
    }
}
