import { PncModel } from './pnc.model';
import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';

export class CrewMemberEnum extends EDossierPncObjectModel {
    pnc: PncModel;
    particularity: string;
    lastEncounterDate: string;
    onBoardFonction: string;
    legId: number;
    rotationId: number;

    getStorageId(): string {
        return `${this.pnc.matricule}-${this.legId}`;
    }
}
