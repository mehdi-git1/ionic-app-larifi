import { PncModel } from './pnc.model';
import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';

export class CrewMemberModel extends EDossierPncObjectModel {
    pnc: PncModel;
    particularity: string;
    onBoardFonction: string;
    legId: number;
    rotationId: number;
    LastOnGroundEncounterDate: Date;
    LastInFlightEncounterDate: Date;

    getStorageId(): string {
        return `${this.pnc.matricule}-${this.legId}`;
    }
}
