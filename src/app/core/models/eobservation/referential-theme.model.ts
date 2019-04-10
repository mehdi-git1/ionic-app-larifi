import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { EObservationItemModel } from './eobservation-item.model';
import { EObservationCommentModel } from './eobservation-comment.model';

export class ReferentialThemeModel extends EDossierPncObjectModel {

    id: number;
    label: string;
    themeOrder: number;
    displayedInProfessionalLevel: boolean;
    subThemes: ReferentialThemeModel[];
    eobservationItems: EObservationItemModel[];
    eobservationComment: EObservationCommentModel;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
