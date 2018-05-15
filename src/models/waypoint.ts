import { PncRole } from './PncRole';
import { Pnc } from './Pnc';

export class Waypoint {
    techId: number;
    pnc: Pnc;
    creationAuthor: Pnc;
    creationDate: string;
    lastUpdateAuthor: Pnc;
    lastUpdateDate: string;
    context: string;
    actionPerformed: string;
    managerComment: string;
    pncComment: string;
}
