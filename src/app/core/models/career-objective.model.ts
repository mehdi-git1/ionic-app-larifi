import { CareerObjectiveStatusEnum } from '../enums/career-objective-status.enum';
import { PncRoleEnum } from '../enums/pnc-role.enum';
import { CareerObjectiveCategory } from './career-objective-category';
import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';
import { PncModel } from './pnc.model';
import { WaypointModel } from './waypoint.model';

export class CareerObjectiveModel extends EDossierPncObjectModel {
    careerObjectiveStatus: CareerObjectiveStatusEnum;
    pnc: PncModel;
    creationAuthor: PncModel;
    creationDate: string;
    registrationDate: string;
    lastUpdateAuthor: PncModel;
    lastUpdateDate: string;
    initiator: PncRoleEnum;
    category: CareerObjectiveCategory;
    title: string;
    context: string;
    actionPlan: string;
    managerComment: string;
    pncComment: string;
    nextEncounterDate: string;
    encounterDate: string;
    prioritized: boolean;
    waypoints: WaypointModel[];
    instructorToBeNotified: boolean;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
