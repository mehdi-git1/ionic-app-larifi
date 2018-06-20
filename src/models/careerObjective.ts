import { Waypoint } from './waypoint';
import { CareerObjectiveStatus } from './careerObjectiveStatus';
import { PncRole } from './pncRole';
import { Pnc } from './pnc';
import { EDossierPncObject } from './eDossierPncObject';

export class CareerObjective extends EDossierPncObject {
    careerObjectiveStatus: CareerObjectiveStatus;
    pnc: Pnc;
    creationAuthor: Pnc;
    creationDate: string;
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
    encounterDate: string;
    prioritized: boolean;
    waypointList: Waypoint[];
}
