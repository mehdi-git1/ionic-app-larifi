import { CareerObjective } from './careerObjective';
import { PncRole } from './pncRole';
import { Pnc } from './pnc';

export class Waypoint {
    techId: number;
    pnc: Pnc;
    creationAuthor: Pnc;
    creationDate: string;
    lastUpdateAuthor: Pnc;
    lastUpdateDate: string;
    initiator: PncRole;
    context: string;
    actionPerformed: string;
    managerComment: string;
    pncComment: string;
    nextEncounterDate: string;
    careerObjective: CareerObjective;
}
