import { HaulTypeEnum } from 'src/app/core/enums/haul-type.enum';

import { GenderEnum } from '../enums/gender.enum';
import { SpecialityEnum } from '../enums/speciality.enum';
import { AssignmentModel } from './assignment.model';
import { DocumentModel } from './document.model';
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
    csvList: Array<PncLightModel>;
    manager: boolean;
    workRate: number;
    prioritized: boolean;
    hasAtLeastOnePriorityInProgress: boolean;
    hasBeenCCIn12LastMonths: boolean;
    statutoryCertificate?: StatutoryCertificateModel;
    groupPlanning: string;
    taf: boolean;
    hasRedactions: boolean;
    acars: string;
    phoneNumber: string;
    documents: Array<DocumentModel> = new Array();
    haulType: HaulTypeEnum;

    getStorageId(): string {
        return this.matricule;
    }
}
