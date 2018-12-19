import { ExerciseLineModel } from './exercise-line.model';
import { ModuleModel } from './module.model';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
export class EvaluationSheetModel extends EDossierPncObjectModel {
    stageCode: string;
    module: ModuleModel;
    e1Score: number;
    e2Score: number;
    fcScore: number;
    evaluationComment: string;
    fcComment: string;
    exercises: ExerciseLineModel[];

    getStorageId(): string {
        return `${this.module.getStorageId}`;
    }
}
