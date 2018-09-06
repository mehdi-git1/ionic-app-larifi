import { Leg } from './leg';
import { Rotation } from './rotation';
import { Pnc } from './pnc';
import { EDossierPncObject } from './eDossierPncObject';

export class EObservation extends EDossierPncObject {
    eObservationType: string;
    redactor: Pnc;
    observedPnc: Pnc;
    rotation: Rotation;
    rotationFirstLeg: Leg;
    rotationLastLeg: Leg;

    getStorageId(): string {
        return `${this.observedPnc.matricule}-${this.rotation.techId}`;
    }

}
