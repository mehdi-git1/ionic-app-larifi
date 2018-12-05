import { SubModuleModel } from './sub-module.model';
import { ModuleModel } from './module.model';

export class EvaluationModel {
    type: string;
    result: number;
    score: number;
    comment: string;
    module: ModuleModel;
    subModules: SubModuleModel[];
}
