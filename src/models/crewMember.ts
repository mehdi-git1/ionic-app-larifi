import { Pnc } from './pnc';
import { EDossierPncObject } from './eDossierPncObject';

export class CrewMember extends EDossierPncObject {
    particularity: string;
    lastEncounterDate: string;
    pnc: Pnc;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
