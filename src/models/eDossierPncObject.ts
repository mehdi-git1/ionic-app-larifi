export abstract class EDossierPncObject {
    techId: number;
    availableOffline: boolean;
    offlineStorageDate: string;

    abstract getStorageId(): string;

    fromJSON(json): any {
        // On désactive tslint car on ne souhaite pas filtrer les propriétés de l'objet
        // tslint:disable-next-line
        for (const property in json) {
            this[property] = json[property];
        }
        return this;
    }
}
