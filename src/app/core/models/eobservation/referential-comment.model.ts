import { EObservationLevelEnum } from './../../enums/e-observations-level.enum';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { ReferentialItemModel } from './referential-item.model';
import { ReferentialThemeModel } from './referential-theme.model';

export class ReferentialCommentModel extends EDossierPncObjectModel {

    theme: ReferentialThemeModel;

    label: string;

    xmlKey: string;

    version: string;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
