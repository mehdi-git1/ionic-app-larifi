import { ExerciseModel } from './exercise.model';
import { EvaluationModel } from './evaluation.model';
export class SubModuleModel {
    label: string;
    order: number;
    evaluation: EvaluationModel;
    exercises: ExerciseModel[];
}
