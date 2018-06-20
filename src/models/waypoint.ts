import { WaypointStatus } from './waypointStatus';
import { CareerObjective } from './careerObjective';
import { PncRole } from './pncRole';
import { Pnc } from './pnc';
import { EDossierPncObject } from './eDossierPncObject';

export class Waypoint extends EDossierPncObject {
    pnc: Pnc;
    creationAuthor: Pnc;
    creationDate: string;
    lastUpdateAuthor: Pnc;
    lastUpdateDate: string;
    context: string;
    actionPerformed: string;
    managerComment: string;
    pncComment: string;
    waypointStatus: WaypointStatus;
    encounterDate: string;
}
