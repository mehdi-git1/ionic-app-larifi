import { ModuleTypeEnum } from './../../enums/module-type.enum';
import { CursusModel } from './cursus.model';
import { ScoreModel } from './score.model';
import { StageModel } from './stage.model';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';

export class ModuleModel extends EDossierPncObjectModel {
    date: Date;
    stage: StageModel;
    moduleType: ModuleTypeEnum;
    label: string;
    moduleResultStatus: string;
    scores: ScoreModel[];
    cursus: CursusModel[];

    getStorageId(): string {
        return `${this.techId}`;
    }
}
