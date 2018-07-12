import { EDossierPncObject } from './eDossierPncObject';

export class AuthenticatedUser extends EDossierPncObject {
    username: string;
    matricule: string;
    fistName: string;
    lastName: string;
    manager: boolean;

    getStorageId(): string {
        return this.username;
    }

    constructor(obj?: any) {
        super(obj);
    }
}
