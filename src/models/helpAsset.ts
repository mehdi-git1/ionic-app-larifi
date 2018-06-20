import { PncRole } from './pncRole';
import { HelpAssetType } from './TypeHelpAsset';
export class HelpAsset {

    helpAssetType: HelpAssetType;
    label: string;
    creationDate: string;
    lastUpdateDate: string;
    url: string;
    pncRole: PncRole;
}
