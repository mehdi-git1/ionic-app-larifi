import { PncModel } from './pnc.model';
import { RotationModel } from './rotation.model';
export class AppContextModel {
    observedPnc: PncModel;
    lastConsultedRotation: RotationModel;
    onBoardRedactorFunction: string;
    onBoardObservedPncFunction: string;
}
