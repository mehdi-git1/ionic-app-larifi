import { ModuleModel } from './module.model';

export class StageModel {
    date: Date;
    code: string;
    label: string;
    result: string;
    modules: ModuleModel[];
}
