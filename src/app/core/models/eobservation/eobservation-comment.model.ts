import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { ReferentialCommentModel } from './eobservation-referential-comment.model';

export class EObservationCommentModel extends EDossierPncObjectModel {

    refComment: ReferentialCommentModel;

    eobservationId: number;

    comment: string;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
