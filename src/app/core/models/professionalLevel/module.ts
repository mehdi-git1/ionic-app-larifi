import { Score } from './score';

export class Module {
    date: Date;
    moduleType: ModuleTypeEnum;
    label: string;
    moduleResultStatus: string;
    scores: Score[];
}
