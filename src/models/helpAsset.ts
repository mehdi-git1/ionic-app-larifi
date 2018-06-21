import { PncRole } from './pncRole';
import { HelpAssetType } from './HelpAssetType';
export class HelpAsset {

    helpAssetType: HelpAssetType;
    label: string;
    creationDate: string;
    lastUpdateDate: string;
    url: string;
    pncRole: PncRole;
}
