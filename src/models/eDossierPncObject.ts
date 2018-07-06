import { OfflineAction } from './offlineAction';
export abstract class EDossierPncObject {
    techId: number;
    offlineStorageDate: string;
    offlineAction: OfflineAction;

    abstract getStorageId(): string;

    fromJSON(json): any {
        for (const property of Object.keys(json)) {
            this[property] = json[property];
        }
        return this;
    }
}
