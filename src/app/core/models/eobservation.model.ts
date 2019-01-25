import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';

export class EObservationModel extends EDossierPncObjectModel {
    matricule: string;

    getStorageId(): string {
        return this.matricule;
    }
}