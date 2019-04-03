import { UserMessageKeyEnum } from "../../enums/admin/user-message-key.enum";
import { EDossierPncObjectModel } from "../e-dossier-pnc-object.model";

export class UserMessageModel extends EDossierPncObjectModel {
    key: UserMessageKeyEnum;
    label: string;
    content: string;
    lastUpdate: Date;
    active: boolean;

    getStorageId(): string {
        return `${this.key}`;
    }
}
