import { Rotation } from './rotation';
import { Waypoint } from './waypoint';
import { CareerObjective } from './careerObjective';
import { Pnc } from './pnc';
import { Leg } from './leg';
import { SummarySheet } from './summarySheet';

export class PncSynchro {
    pnc: Pnc;
    summarySheet: SummarySheet;
    careerObjectives: CareerObjective[];
    waypoints: Waypoint[];
    upcomingRotations: Rotation[];
    upcomingLegs: Leg[];
    lastPerfomedRotation: Rotation;
    lastPerfomedLegs: Leg[];
}
