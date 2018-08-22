import { EDossierPncObject } from './eDossierPncObject';

export class AuthenticatedUser extends EDossierPncObject {
    matricule: string;
    fistName: string;
    lastName: string;
    manager: boolean;
    pinCode ?: number;
    secretQuestion ?: string;
    secretAnswer ?: string;

    getStorageId(): string {
        return this.matricule;
    }
}
