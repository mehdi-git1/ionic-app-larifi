import { PncRole } from './PncRole';
import { Pnc } from './Pnc';

export class CareerObjective {
    techId: number;
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
    urgent: boolean;
}
