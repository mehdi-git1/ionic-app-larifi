import { CongratulationLetterFlightModel } from './congratulation-letter-flight.model';
import { PncModel } from './pnc.model';

export class CongratulationLetterModel {
    creationDate: Date;
    flight: CongratulationLetterFlightModel;
    collective: boolean;
    writer: PncModel;
}
