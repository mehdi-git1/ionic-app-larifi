import { RelayModel } from './relay.model';
import { StatutoryCertificateModel } from './statutory.certificate.model';
import { GenderEnum } from '../enums/gender.enum';
import { AssignmentModel } from './assignment.model';
import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';
import {SpecialityEnum} from '../enums/speciality.enum';

export class PncModel extends EDossierPncObjectModel {
    matricule: string;
    lastName: string;
    firstName: string;
    gender: GenderEnum;
    speciality: SpecialityEnum;
    currentSpeciality: SpecialityEnum;
    operationalSpeciality: SpecialityEnum;
    assignment: AssignmentModel;
    relays: RelayModel[];
    aircraftSkills: string[];
    manager: boolean;
    workRate: number;
    prioritized: boolean;
    statutoryCertificate?: StatutoryCertificateModel;

    getStorageId(): string {
        return this.matricule;
    }
}