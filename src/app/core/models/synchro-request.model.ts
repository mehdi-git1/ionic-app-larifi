import { PncModel } from './pnc.model';
import { SynchroStatusEnum } from '../enums/synchronization/synchro-status.enum';

export class SynchroRequestModel {
    pnc: PncModel;
    synchroStatus: SynchroStatusEnum;
    errorMessage: string;
}
