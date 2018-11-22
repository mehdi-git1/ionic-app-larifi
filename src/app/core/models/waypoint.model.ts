import { WaypointStatusEnum } from '../enums/waypoint.status.enum';
import { CareerObjectiveModel } from './career-objective.model';
import { PncModel } from './pnc.model';
import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';

export class WaypointModel extends EDossierPncObjectModel {
    creationAuthor: PncModel;
    creationDate: string;
    lastUpdateAuthor: PncModel;
    lastUpdateDate: string;
    context: string;
    actionPerformed: string;
    managerComment: string;
    pncComment: string;
    waypointStatus: WaypointStatusEnum;
    encounterDate: string;
    careerObjective: CareerObjectiveModel;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
