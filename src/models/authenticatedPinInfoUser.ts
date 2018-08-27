import { EDossierPncObject } from './eDossierPncObject';

export class AuthenticatedPinInfoUser extends EDossierPncObject {
    matricule: string;
    pinCode: number;
    secretQuestion: string;
    secretAnswer: string;

    getStorageId(): string {
        return this.matricule;
    }
}
