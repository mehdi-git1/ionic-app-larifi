import { PncModel } from './pnc.model';
import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';

export class CrewMemberModel extends EDossierPncObjectModel {
    pnc: PncModel;
    particularity: string;
    onBoardFonction: string;
    legId: number;
    rotationId: number;
    lastOnGroundEncounterDate: Date;
    lastInFlightEncounterDate: Date;

    getStorageId(): string {
        return `${this.pnc.matricule}-${this.legId}`;
    }
}
