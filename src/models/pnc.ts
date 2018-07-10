import { Gender } from './gender';
import { Speciality } from './speciality';
import { Assignment } from './assignment';
export class Pnc {
    matricule: string;
    lastName: string;
    firstName: string;
    gender: Gender;
    speciality: Speciality;
    assignment: Assignment;
    relays: string[];
    aircraftSkills: string[];
}
