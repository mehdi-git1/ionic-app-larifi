import { ModuleTypeEnum } from './../../enums/module-type.enum';
import { CursusModel } from './cursus.model';
import { ScoreModel } from './score.model';
import { StageModel } from './stage.model';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { ProfessionalLevelResultStatus } from '../../enums/professional-level-result-status.enum';

export class ModuleModel extends EDossierPncObjectModel {
    date: Date;
    stage: StageModel;
    moduleType: ModuleTypeEnum;
    label: string;
    moduleResultStatus: ProfessionalLevelResultStatus;
    scores: ScoreModel[];
    cursus: CursusModel[];

    getStorageId(): string {
        return `${this.techId}`;
    }
}
