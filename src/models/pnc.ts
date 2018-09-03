import { Gender } from './gender';
import { Speciality } from './speciality';
import { Assignment } from './assignment';
import { EDossierPncObject } from './eDossierPncObject';
export class Pnc extends EDossierPncObject {
    matricule: string;
    lastName: string;
    firstName: string;
    gender: Gender;
    speciality: Speciality;
    assignment: Assignment;
    relays: string[];
    aircraftSkills: string[];
    manager: boolean;
    workRate: number;
    prioritized: boolean;

    getStorageId(): string {
        return this.matricule;
    }
}
