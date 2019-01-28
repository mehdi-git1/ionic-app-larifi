import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { QuestionResultEnum } from '../../enums/question-result.enum';

export class QuestionModel extends EDossierPncObjectModel {
    label: string;
    date: Date;
    score: number;
    questionResult: QuestionResultEnum;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
