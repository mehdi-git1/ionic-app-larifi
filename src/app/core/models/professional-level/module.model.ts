import { ScoreModel } from './score.model';
import { StageModel } from './stage.model';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';

export class ModuleModel extends EDossierPncObjectModel {
    id: number;
    date: Date;
    stage: StageModel;
    moduleType: ModuleTypeEnum;
    label: string;
    moduleResultStatus: string;
    scores: ScoreModel[];

    getStorageId(): string {
        return `${this.techId}`;
    }
}
