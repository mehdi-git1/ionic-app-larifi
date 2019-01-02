import { CursusResultEnum } from './../../enums/cursus-result.enum';
import { CursusOrderEnum } from './../../enums/cursus-order.enum';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { QuestionModel } from './question.model';

export class CursusModel extends EDossierPncObjectModel {
    code: string;
    result: CursusResultEnum;
    score: number;
    orderNumber: CursusOrderEnum;
    label: string;
    questions: QuestionModel[];
    date: Date;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
