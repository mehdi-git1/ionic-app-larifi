import { Score } from "./score";

export class Module {
    date: Date;
    moduleCode: ModuleTypeEnum;
    label: string;
    moduleResultStatus: string;
    scores: Score[];
}