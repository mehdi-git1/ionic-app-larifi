import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { ReferentialItemLevelModel } from './referential-item-level.model';
import { ReferentialCommentModel } from './referential-comment.model';

export class EObservationCommentModel extends EDossierPncObjectModel {

    refComment: ReferentialCommentModel;

    eobservationId: number;

    comment: string;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
