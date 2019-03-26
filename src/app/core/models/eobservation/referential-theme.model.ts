import { EObservationLevelEnum } from '../../enums/e-observations-level.enum';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';

export class ReferentialThemeModel extends EDossierPncObjectModel {

    id: number;

    parent: ReferentialThemeModel;

    label: string;

    themeOrder: number;

    displayedInProfessionalLevel: boolean;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
