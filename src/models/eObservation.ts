import { Leg } from './leg';
import { Rotation } from './rotation';
import { Pnc } from './pnc';

export class EObservation {
    eObsType: string;
    redactor: Pnc;
    observedPnc: Pnc;
    rotation: Rotation;
    firtRotationLeg: Leg;
    lastRotationLeg: Leg;
}
