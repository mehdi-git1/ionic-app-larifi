import { EDossierPncObject } from './eDossierPncObject';

export class SummarySheet extends EDossierPncObject {
    matricule: string;
    summarySheet: Blob;

    getStorageId(): string {
        return this.matricule;
    }
}
