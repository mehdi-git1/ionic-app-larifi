import { EDossierPncObject } from './eDossierPncObject';
import { Pnc } from './pnc';

export class CrewMember extends EDossierPncObject {
    particulariy: string;
    lastEncounterDate: string;
    pnc: Pnc;
    onBoardFonction: string;
    prioritized: boolean;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
