import { PncPinModel } from './pnc-pin.model';

import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';
import { ParametersModel } from './parameters.model';

export class AuthenticatedUserModel extends EDossierPncObjectModel {
    matricule: string;
    firstName: string;
    lastName: string;
    isManager: boolean;
    isPnc: boolean;
    pinInfo?: PncPinModel;
    profiles: string[];
    permissions: string[];
    parameters: ParametersModel;

    getStorageId(): string {
        return this.matricule;
    }
}
