import { PncRoleEnum } from '../enums/pnc-role.enum';
import { HelpAssetTypeEnum } from '../enums/help-asset-type.enum';
export class HelpAssetModel {

    helpAssetType: HelpAssetTypeEnum;
    label: string;
    creationDate: string;
    lastUpdateDate: string;
    url: string;
    pncRole: PncRoleEnum;
}
