import { Rotation } from './rotation';
import { Waypoint } from './waypoint';
import { CareerObjective } from './careerObjective';
import { Pnc } from './pnc';

export class PncSynchro {
    pnc: Pnc;
    careerObjectives: CareerObjective[];
    waypoints: Waypoint[];
    rotations: Rotation[];
}
