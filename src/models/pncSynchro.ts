import { Waypoint } from './waypoint';
import { CareerObjective } from './careerObjective';
import { Pnc } from './pnc';
import { SummarySheet } from './summarySheet';

export class PncSynchro {
    pnc: Pnc;
    summarySheet: SummarySheet;
    careerObjectives: CareerObjective[];
    waypoints: Waypoint[];
}
