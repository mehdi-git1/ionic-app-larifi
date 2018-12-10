import { ExerciseModel } from './exercise.model';
import { ModuleModel } from './module.model';
import { EvaluationModel } from './evaluation.model';
import { SubModuleModel } from './sub-module.model';
export class EvaluationSheetModel {
    stageCode: string;
    module: ModuleModel;
    e1Score: number;
    e2Score: number;
    fcScore: number;
    evaluationComment: string;
    fcComment: string;
    exercises: ExerciseModel[];
}
