import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';

export class ShortLoopCommentModel extends EDossierPncObjectModel {
    numberOfRespondants: number;
    rating: number;
    appreciatedPoints: string;
    appreciatedPointsReported: boolean;
    pointsToImprove: string;
    pointsToImproveReported: boolean;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
