import { Waypoint } from './waypoint';
import { CareerObjectiveStatus } from './careerObjectiveStatus';
import { PncRole } from './pncRole';
import { Pnc } from './pnc';

export class CareerObjective {
    techId: number;
    careerObjectiveStatus: CareerObjectiveStatus;
    pnc: Pnc;
    creationAuthor: Pnc;
    creationDate: Date;
    registrationDate: string;
    lastUpdateAuthor: Pnc;
    lastUpdateDate: string;
    initiator: PncRole;
    title: string;
    context: string;
    actionPlan: string;
    managerComment: string;
    pncComment: string;
    nextEncounterDate: string;
    prioritized: boolean;
    waypointList: Waypoint[];
}
