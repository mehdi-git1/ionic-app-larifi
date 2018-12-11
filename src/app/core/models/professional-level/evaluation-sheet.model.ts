import { ExerciseModel } from './exercise.model';
import { ModuleModel } from './module.model';
import { EvaluationModel } from './evaluation.model';
import { SubModuleModel } from './sub-module.model';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
export class EvaluationSheetModel extends EDossierPncObjectModel {
    stageCode: string;
    module: ModuleModel;
    e1Score: string;
    e2Score: string;
    fcScore: string;
    evaluationComment: string;
    fcComment: string;
    exercises: ExerciseModel[];

    getStorageId(): string {
        return `${this.module.getStorageId}`;
    }
}
