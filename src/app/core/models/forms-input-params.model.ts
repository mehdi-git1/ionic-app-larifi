import { LegModel } from './leg.model';
import { RotationModel } from './rotation.model';
import { PncModel } from './pnc.model';

export class FormsInputParamsModel {
    redactor: PncModel;
    observedPnc: PncModel;
    rotation: RotationModel;
    rotationFirstLeg: LegModel;
    rotationLastLeg: LegModel;
}
