import { LegModel } from './leg.model';
import { RotationModel } from './rotation.model';
import { PncModel } from './pnc.model';
import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';

export class EObservationModel extends EDossierPncObjectModel {
    eObservationType: string;
    redactor: PncModel;
    observedPnc: PncModel;
    rotation: RotationModel;
    rotationFirstLeg: LegModel;
    rotationLastLeg: LegModel;

    getStorageId(): string {
        return `${this.observedPnc.matricule}-${this.rotation.techId}`;
    }

}
