import { OfflineAction } from './offlineAction';
export abstract class EDossierPncObject {
    techId: number;
    availableOffline: boolean;
    offlineStorageDate: string;
    offlineAction: OfflineAction;

    abstract getTechId(): string;

    fromJSON(json): any {
        for (const property of Object.keys(json)) {
            this[property] = json[property];
        }
        return this;
    }
}
