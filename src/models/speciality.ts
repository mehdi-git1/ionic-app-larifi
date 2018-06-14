import { PncRole } from './pncRole';

export enum Speciality {

    CDB = 'CDB',
    OPL = 'OPL',
    OMN = 'OMN',
    CAD = 'CAD',
    CCP = 'CCP',
    CC = 'CC',
    HOT = 'HOT',
    STW = 'STW'
}

export namespace Speciality {
    /**
     * @param speciality 
     * @returns return enum pnc role that correspond to the speciality given
     */
    export function getPncRole(speciality: Speciality) {

        if (Speciality.CAD === speciality) {
            return PncRole.MANAGER;
        } else {
            return PncRole.PNC;
        }
    }
}


