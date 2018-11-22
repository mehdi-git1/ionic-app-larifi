import { EDossierPncObjectModel } from './e-dossier-pnc-object.model';

export class SummarySheetModel extends EDossierPncObjectModel {
    matricule: string;
    summarySheet: string;

    getStorageId(): string {
        return this.matricule;
    }
}
