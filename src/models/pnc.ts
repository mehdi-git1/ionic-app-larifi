import { Gender } from './gender';
import { Speciality } from './speciality';
import { Assignment } from './assignment';
import { Object } from './object';
export class Pnc extends Object {
    matricule: string;
    lastName: string;
    firstName: string;
    gender: Gender;
    speciality: Speciality;
    assignment: Assignment;
    manager: boolean;
}
