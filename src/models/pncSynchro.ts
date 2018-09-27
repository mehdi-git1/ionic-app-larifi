import { StatutoryCertificate } from './statutoryCertificate';
import { PncPhoto } from './pncPhoto';
import { Rotation } from './rotation';
import { Waypoint } from './waypoint';
import { CareerObjective } from './careerObjective';
import { Pnc } from './pnc';
import { Leg } from './leg';
import { SummarySheet } from './summarySheet';

export class PncSynchro {
    pnc: Pnc;
    summarySheet: SummarySheet;
    photo: PncPhoto;
    careerObjectives: CareerObjective[];
    waypoints: Waypoint[];
    rotations: Rotation[];
    legs: Leg[];
    statutoryCertificate: StatutoryCertificate;
}
