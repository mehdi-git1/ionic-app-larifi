import { EObservationTypeEnum } from './../../enums/e-observations-type.enum';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { ReferentialThemeModel } from './eobservation-referential-theme.model';
import { ReferentialItemLevelModel } from './eobservation-referential-item-level.model';

export class ReferentialItemModel extends EDossierPncObjectModel {

    theme: ReferentialThemeModel;

    levels: ReferentialItemLevelModel[];

    label: string;

    shortLabel: string;

    xmlKey: string;

    version: string;

    itemOrder: number;

    type: EObservationTypeEnum;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
