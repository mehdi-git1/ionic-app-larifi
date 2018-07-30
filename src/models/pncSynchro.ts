import { Rotation } from './rotation';
import { Waypoint } from './waypoint';
import { CareerObjective } from './careerObjective';
import { Pnc } from './pnc';
import { Leg } from './leg';

export class PncSynchro {
    pnc: Pnc;
    careerObjectives: CareerObjective[];
    waypoints: Waypoint[];
    rotations: Rotation[];
    legs: Leg[];
}
