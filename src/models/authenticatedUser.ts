import { PncPin } from './pncPin';

import { EDossierPncObject } from './eDossierPncObject';

export class AuthenticatedUser extends EDossierPncObject {
    matricule: string;
    fistName: string;
    lastName: string;
    manager: boolean;
    pinInfo?: PncPin;

    getStorageId(): string {
        return this.matricule;
    }
}
