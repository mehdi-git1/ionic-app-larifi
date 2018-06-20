import { EDossierPncObject } from './eDossierPncObject';

export class CrewMember extends EDossierPncObject {
    matricule: string;
    firstname: string;
    lastName: string;
    particulariy: string;
    lastEncounterDate: string;
    relays: string[];
}
