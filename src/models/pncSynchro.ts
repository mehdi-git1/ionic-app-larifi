import { Rotation } from './rotation';
import { Waypoint } from './waypoint';
import { CareerObjective } from './careerObjective';
import { Pnc } from './pnc';
import { Leg } from './leg';

export class PncSynchro {
    pnc: Pnc;
    careerObjectives: CareerObjective[];
    waypoints: Waypoint[];
    upcomingRotations: Rotation[];
    upcomingLegs: Leg[];
    lastRotation: Rotation;
    lastLegs: Leg[];
}
