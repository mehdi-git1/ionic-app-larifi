import { OfflineAction } from './offlineAction';
export abstract class EDossierPncObject {
    techId: number;
    offlineStorageDate: string;
    offlineAction: OfflineAction;

    /**
     * Récupère l'id de stockage de l'objet. L'id de stockage correspond à la clef primaire de l'entité
     * @return l'id de stockage
     */
    abstract getStorageId(): string;

    /**
     * Transforme un objet json en entité
     * @param json l'objet json
     * @return l'entité correspondante au json
     */
    fromJSON(json): any {
        for (const property of Object.keys(json)) {
            this[property] = json[property];
        }
        return this;
    }
}
