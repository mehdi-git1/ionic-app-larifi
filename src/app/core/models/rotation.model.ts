import { LegModel } from './leg.model';
import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';

export class RotationModel extends EDossierPncObjectModel {
    number: string;
    departureDate: string;
    legs: LegModel[];

    // Champs utilitaires (pour le fonctionnement des IHM)
    opened: boolean;
    loading: boolean;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
