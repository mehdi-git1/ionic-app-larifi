import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';

export class EScoreCommentModel extends EDossierPncObjectModel {
    numberOfRespondents: number;
    rating: number;
    positivePersonalFeedbackReason: string;
    positivePersonalFeedbackReasonReported: boolean;
    negativePersonalFeedbackReason: string;
    negativePersonalFeedbackReasonReported: boolean;
    suggestions: string;
    suggestionsReported: boolean;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
