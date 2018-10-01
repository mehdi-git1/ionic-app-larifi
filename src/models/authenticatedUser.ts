import { PncPin } from './pncPin';

import { EDossierPncObject } from './eDossierPncObject';

export class AuthenticatedUser extends EDossierPncObject {
    matricule: string;
    fistName: string;
    lastName: string;
    manager: boolean;
    pnc: boolean;
    pinInfo?: PncPin;
    profiles: string[];

    getStorageId(): string {
        return this.matricule;
    }
}
