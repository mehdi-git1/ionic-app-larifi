import { Gender } from './gender';
import { Speciality } from './speciality';
import { Assignment } from './assignment';
import { Offline } from './offline';
export class Pnc extends Offline {
    matricule: string;
    lastName: string;
    firstName: string;
    gender: Gender;
    speciality: Speciality;
    assignment: Assignment;
    manager: boolean;
}
