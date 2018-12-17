import { EvaluationSheetModel } from './evaluation-sheet.model';
import { StageModel } from './stage.model';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';

export class ProfessionalLevelModel extends EDossierPncObjectModel {
    matricule: string;
    stages: StageModel[];
    evaluationSheets: EvaluationSheetModel[];

    getStorageId(): string {
        return `${this.matricule}`;
    }
}
