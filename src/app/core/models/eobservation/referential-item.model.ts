import { EObservationTypeEnum } from './../../enums/e-observations-type.enum';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { ReferentialThemeModel } from './referential-theme.model';

export class ReferentialItemModel extends EDossierPncObjectModel {

    theme: ReferentialThemeModel;

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
