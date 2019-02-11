import { CongratulationLetterFlightModel } from './congratulation-letter-flight.model';
import { PncModel } from './pnc.model';
import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';

export class CongratulationLetterModel extends EDossierPncObjectModel {
    dominoId: number;
    airlineOwner: string;
    title: string;
    verbatim: string;
    creationDate: Date;
    collective: boolean;
    flight: CongratulationLetterFlightModel;
    redactor: PncModel;
    concernedPncs: PncModel[];

    getStorageId(): string {
        return `${this.techId}`;
    }
}
