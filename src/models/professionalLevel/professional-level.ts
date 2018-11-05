import { Stage } from './stage';
import { EDossierPncObject } from '../eDossierPncObject';

export class ProfessionalLevel extends EDossierPncObject {
    matricule: string;
    stagesList: Stage[];

    getStorageId(): string {
        return `${this.matricule}`;
    }
}
