import { Stage } from './stage';
import { EDossierPncObject } from '../eDossierPncObject';

export class ProfessionalLevel extends EDossierPncObject {
    matricule: string;
    stages: Stage[];

    getStorageId(): string {
        return `${this.matricule}`;
    }
}
