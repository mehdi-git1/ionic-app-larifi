import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { ReferentialItemLevelModel } from './eobservation-referential-item-level.model';

export class EObservationItemModel extends EDossierPncObjectModel {

    comment: string;

    refItemLevel: ReferentialItemLevelModel;

    itemOrder: number;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
