import { EObservationLevelEnum } from '../../enums/e-observations-level.enum';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';

export class ReferentialThemeModel extends EDossierPncObjectModel {

    parent: ReferentialThemeModel;

    label: string;

    themeOrder: number;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
