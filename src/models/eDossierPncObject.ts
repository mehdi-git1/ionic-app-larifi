import { Serializable } from './serializable';
import { OfflineAction } from './offlineAction';
export abstract class EDossierPncObject extends Serializable {
    techId: number;
    offlineStorageDate: string;
    offlineAction: OfflineAction;

    /**
     * Récupère l'id de stockage de l'objet. L'id de stockage correspond à la clef primaire de l'entité
     * @return l'id de stockage
     */
    abstract getStorageId(): string;

}
