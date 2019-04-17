import { EObservationLevelEnum } from './../../enums/e-observations-level.enum';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { ReferentialItemModel } from './eobservation-referential-item.model';

export class ReferentialItemLevelModel extends EDossierPncObjectModel {

    item: ReferentialItemModel;

    level: EObservationLevelEnum;

    levelDescription: string;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
