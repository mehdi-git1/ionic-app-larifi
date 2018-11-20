import { Serializable } from '../../shared/utils/serializable';
import { OfflineActionEnum } from '../enums/offline-action.enum';

export abstract class EDossierPncObjectModel extends Serializable {
    techId: number;
    offlineStorageDate: string;
    offlineAction: OfflineActionEnum;

    /**
     * Récupère l'id de stockage de l'objet. L'id de stockage correspond à la clef primaire de l'entité
     * @return l'id de stockage
     */
    abstract getStorageId(): string;

}
