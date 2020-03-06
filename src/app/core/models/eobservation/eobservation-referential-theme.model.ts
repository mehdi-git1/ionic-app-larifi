import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { EObservationCommentModel } from './eobservation-comment.model';
import { EObservationItemModel } from './eobservation-item.model';

export class ReferentialThemeModel extends EDossierPncObjectModel {

    id: number;
    label: string;
    themeOrder: number;
    parent: ReferentialThemeModel;
    displayedInProfessionalLevel: boolean;
    subThemes: ReferentialThemeModel[];
    eobservationItems: EObservationItemModel[];
    eobservationComment: EObservationCommentModel;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
