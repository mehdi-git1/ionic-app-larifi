import { NotifiedPncSpecialityEnum } from '../../enums/notified-pnc-speciality.enum';
import { PncModel } from '../pnc.model';

export class LogbookEventNotifiedPnc {
    pnc: PncModel;
    speciality: NotifiedPncSpecialityEnum;
}
