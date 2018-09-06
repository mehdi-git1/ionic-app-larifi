import { Pnc } from './pnc';
import { EDossierPncObject } from './eDossierPncObject';

export class CrewMember extends EDossierPncObject {
    pnc: Pnc;
    particularity: string;
    lastEncounterDate: string;
    onBoardFonction: string;
    legId: number;
    rotationId: number;

    getStorageId(): string {
        return `${this.pnc.matricule}-${this.legId}`;
    }
}
