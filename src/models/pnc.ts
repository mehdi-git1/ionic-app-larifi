import { Relay } from './relay';
import { StatutoryCertificate } from './statutoryCertificate';
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
    currentSpeciality: Speciality;
    assignment: Assignment;
    relays: Relay[];
    aircraftSkills: string[];
    manager: boolean;
    workRate: number;
    prioritized: boolean;
    statutoryCertificate?: StatutoryCertificate;

    getStorageId(): string {
        return this.matricule;
    }
}
