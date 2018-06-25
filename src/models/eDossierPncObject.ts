export abstract class EDossierPncObject {
    techId: number;
    availableOffline: boolean;
    offlineStorageDate: string;

    abstract getStorageId(): string;

    fromJSON(json): any {
        for (const property of Object.keys(json)) {
            this[property] = json[property];
        }
        return this;
    }
}
