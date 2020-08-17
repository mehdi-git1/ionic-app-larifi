import {
    CongratulationLetterRedactorTypeEnum
} from '../enums/congratulation-letter/congratulation-letter-redactor-type.enum';
import {
    CongratulationLetterStatusEnum
} from '../enums/congratulation-letter/congratulation-letter-status.enum';
import { CongratulationLetterFlightModel } from './congratulation-letter-flight.model';
import { DocumentModel } from './document.model';
import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';
import { PncModel } from './pnc.model';

export class CongratulationLetterModel extends EDossierPncObjectModel {
    dominoId: number;
    airlineOwner: string;
    title: string;
    verbatim: string;
    creationDate: Date;
    creationAuthor: PncModel;
    lastUpdateDate: Date;
    lastUpdateAuthor: PncModel;
    collective: boolean;
    flight: CongratulationLetterFlightModel;
    redactor: PncModel;
    concernedPncs: PncModel[];
    redactorSpeciality: string;
    redactorType: CongratulationLetterRedactorTypeEnum;
    documents: Array<DocumentModel> = new Array();
    status: CongratulationLetterStatusEnum;
    deletedByRedactor: boolean;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
