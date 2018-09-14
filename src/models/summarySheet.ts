import { EDossierPncObject } from './eDossierPncObject';

export class SummarySheet extends EDossierPncObject {
    matricule: string;
    summarySheet: string;

    getStorageId(): string {
        return this.matricule;
    }
}
