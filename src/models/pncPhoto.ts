import { EDossierPncObject } from './eDossierPncObject';

export class PncPhoto extends EDossierPncObject {
    matricule: string;
    photo: Blob;

    getStorageId(): string {
        return this.matricule;
    }
}
