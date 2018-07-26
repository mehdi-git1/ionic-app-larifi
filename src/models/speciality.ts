import { PncRole } from './pncRole';

export enum Speciality {

    CAD = 'CAD',
    CCP = 'CCP',
    CC = 'CC',
    HOT = 'HOT',
    STW = 'STW'
}

export namespace Speciality {
    /**
     * Permet de retourner le role du PNC en fonction de sa spécialité
     * @param speciality Donner la spécialité du PNC
     * @return Retourne l'enum PNC role qui correspond à la spécialité donné
     */
    export function getPncRole(speciality: Speciality) {

        if (Speciality.CAD === speciality) {
            return PncRole.MANAGER;
        } else {
            return PncRole.PNC;
        }
    }
}


