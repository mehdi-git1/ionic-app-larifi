import { Leg } from './leg';

export class Rotation {
    techId: number;
    number: string;
    departureDate: string;
    legs: Leg[];

    // Champs utilitaires (pour le fonctionnement des IHM)
    opened: boolean;
    loading: boolean;
}
