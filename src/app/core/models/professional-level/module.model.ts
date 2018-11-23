import { ScoreModel } from './score.model';

export class ModuleModel {
    date: Date;
    moduleType: ModuleTypeEnum;
    label: string;
    moduleResultStatus: string;
    scores: ScoreModel[];
}
