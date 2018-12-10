import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';

export class PncPhotoModel extends EDossierPncObjectModel {
    matricule: string;
    photo: string;

    getStorageId(): string {
        return this.matricule;
    }
}
