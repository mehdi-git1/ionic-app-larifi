import { CareerObjective } from './careerObjective';
import { PncRole } from './PncRole';
import { Pnc } from './Pnc';

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
    careerObjectiveId: number;
}
