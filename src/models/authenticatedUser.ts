import { EDossierPncObject } from './eDossierPncObject';

export class AuthenticatedUser extends EDossierPncObject {
    matricule: string;
    fistName: string;
    lastName: string;
    manager: boolean;

    getStorageId(): string {
        return this.matricule;
    }
}
