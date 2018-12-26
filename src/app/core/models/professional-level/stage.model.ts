import { ModuleModel } from './module.model';

export class StageModel {
    matricule: string;
    date: Date;
    code: string;
    label: string;
    result: string;
    stageResultStatus: string;
    modules: ModuleModel[];
}
