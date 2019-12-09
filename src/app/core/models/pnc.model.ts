import { GenderEnum } from '../enums/gender.enum';
import { SpecialityEnum } from '../enums/speciality.enum';
import { AssignmentModel } from './assignment.model';
import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';
import { PncLightModel } from './pnc-light.model';
import { RelayModel } from './statutory-certificate/relay.model';
import { StatutoryCertificateModel } from './statutory.certificate.model';

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
    aircraftSkillsLabel: string[];
    pncInstructor: PncLightModel;
    pncRds: PncLightModel;
    pncRdd: PncLightModel;
    manager: boolean;
    workRate: number;
    prioritized: boolean;
    hasAtLeastOnePriorityInProgress: boolean;
    statutoryCertificate?: StatutoryCertificateModel;
    groupPlanning: string;
    hasRedactions: boolean;
    acars: string;
    phoneNumber: string;

    getStorageId(): string {
        return this.matricule;
    }
}
