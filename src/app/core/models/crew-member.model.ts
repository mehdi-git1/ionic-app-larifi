import { LegModel } from './leg.model';
import { PncModel } from './pnc.model';
import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';

export class CrewMemberModel extends EDossierPncObjectModel {
    pnc: PncModel;
    particularity: string;
    lastEncounterDate: string;
    onBoardFonction: string;
    leg: LegModel;

    getStorageId(): string {
        return `${this.pnc.matricule}-${this.leg.company}-${this.leg.number}-${this.leg.departureDate}`;
    }
}
