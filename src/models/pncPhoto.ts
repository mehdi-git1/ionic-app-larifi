import { EDossierPncObject } from './eDossierPncObject';

export class PncPhoto extends EDossierPncObject {
    matricule: string;
    photo: string;

    getStorageId(): string {
        return this.matricule;
    }
}
