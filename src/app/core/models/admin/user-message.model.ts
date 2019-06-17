import { UserMessageKeyEnum } from '../../enums/admin/user-message-key.enum';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';

export class UserMessageModel extends EDossierPncObjectModel {
    key: UserMessageKeyEnum;
    label: string;
    title: string;
    content: string;
    lastUpdateDate: Date;
    active: boolean;

    getStorageId(): string {
        return `${this.key}`;
    }
}
