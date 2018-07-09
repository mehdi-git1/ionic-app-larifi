import { EDossierPncObject } from './eDossierPncObject';
import { Pnc } from './pnc';

export class CrewMember extends EDossierPncObject {
    particulariy: string;
    lastEncounterDate: string;
    pnc: Pnc;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
