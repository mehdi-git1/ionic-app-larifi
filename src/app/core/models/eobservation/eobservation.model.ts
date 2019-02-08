import { EObservationItemModel } from './eobservation-item.model';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { PncModel } from '../pnc.model';
import { EObservationTypeEnum } from '../../enums/e-observations-type.enum';

export class EObservationModel extends EDossierPncObjectModel {

    pnc: PncModel;
    rotationDate: Date;
    type: EObservationTypeEnum;
    redactor: PncModel;
    eobservationItems: EObservationItemModel[];

    getStorageId(): string {
        return `${this.techId}`;
    }
}
