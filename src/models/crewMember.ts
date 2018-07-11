import { Pnc } from './pnc';
import { EDossierPncObject } from './eDossierPncObject';

export class CrewMember extends EDossierPncObject {
    particulariy: string;
    lastEncounterDate: string;
    pnc: Pnc;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
