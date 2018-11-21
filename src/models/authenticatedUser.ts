import { PncPin } from './pncPin';

import { EDossierPncObject } from './eDossierPncObject';

export class AuthenticatedUser extends EDossierPncObject {
    matricule: string;
    firstName: string;
    lastName: string;
    isManager: boolean;
    isPnc: boolean;
    pinInfo?: PncPin;
    profiles: string[];
    permissions: string[];

    getStorageId(): string {
        return this.matricule;
    }
}
