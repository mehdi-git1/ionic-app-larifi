import { ModuleModel } from './module.model';
import { EvaluationModel } from './evaluation.model';
import { SubModuleModel } from './sub-module.model';
export class EvaluationSheetModel {
    module: ModuleModel;
    evaluationE1: EvaluationModel;
    evaluationE2: EvaluationModel;
    evaluationComment: string;
    fc: EvaluationModel;

}
