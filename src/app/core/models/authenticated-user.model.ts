import { AppVersionModel } from './admin/app-version.model';
import { UserMessageModel } from './admin/user-message.model';
import { AppInitDataModel } from './app-init-data.model';
import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';
import { PncPinModel } from './pnc-pin.model';
import { PncModel } from './pnc.model';

export class AuthenticatedUserModel extends EDossierPncObjectModel {
    matricule: string;
    firstName: string;
    lastName: string;
    isManager: boolean;
    isPnc: boolean;
    isRds: boolean;
    isRdd: boolean;
    isBaseProvinceManager: boolean;
    authenticatedPnc: PncModel;
    pncPin: PncPinModel;
    profiles: string[];
    permissions: string[];
    appInitData: AppInitDataModel;
    userMessage: UserMessageModel;
    appVersion: AppVersionModel;
    eFormsWrittenUrl: string;
    cabinReportsWrittenUrl: string;

    getStorageId(): string {
        return this.matricule;
    }
}
