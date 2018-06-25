import { Leg } from './leg';
import { EDossierPncObject } from './eDossierPncObject';

export class Rotation extends EDossierPncObject {
    number: string;
    departureDate: string;
    legs: Leg[];

    // Champs utilitaires (pour le fonctionnement des IHM)
    opened: boolean;
    loading: boolean;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
