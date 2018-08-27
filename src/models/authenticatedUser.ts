import { AuthenticatedPinInfoUser } from './authenticatedPinInfoUser';
import { EDossierPncObject } from './eDossierPncObject';

export class AuthenticatedUser extends EDossierPncObject {
    matricule: string;
    fistName: string;
    lastName: string;
    manager: boolean;
    pinInfo?: AuthenticatedPinInfoUser;

    getStorageId(): string {
        return this.matricule;
    }
}
