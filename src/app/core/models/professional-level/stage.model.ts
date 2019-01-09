import { ProfessionalLevelResultStatus } from './../../enums/professional-level-result-status.enum';
import { ModuleModel } from './module.model';

export class StageModel {
    matricule: string;
    date: Date;
    code: string;
    label: string;
    result: string;
    stageResultStatus: ProfessionalLevelResultStatus;
    modules: ModuleModel[];
}
