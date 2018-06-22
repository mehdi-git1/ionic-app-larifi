import { Leg } from './leg';
import { Rotation } from './rotation';
import { Pnc } from './pnc';

export class EObservation {
    eObservationType: string;
    redactor: Pnc;
    observedPnc: Pnc;
    rotation: Rotation;
    firstRotationLeg: Leg;
    lastRotationLeg: Leg;
}
