import { SynchroRequestTypeEnum } from '../enums/synchronization/synchro-request-type.enum';
import { SynchroStatusEnum } from '../enums/synchronization/synchro-status.enum';
import { PncSynchroModel } from './pnc-synchro.model';
import { PncModel } from './pnc.model';

export class SynchroRequestModel {
    pnc: PncModel;
    pncSynchro: PncSynchroModel;
    requestType: SynchroRequestTypeEnum;
    synchroStatus: SynchroStatusEnum;
    errorMessage: string;
}
