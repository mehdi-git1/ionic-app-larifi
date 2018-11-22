import { ModuleModel } from './module.model';

export class StageModel {
    startDate: Date;
    code: string;
    label: string;
    result: string;
    modules: ModuleModel[];
}
