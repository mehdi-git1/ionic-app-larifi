import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
export class AppVersionModel extends EDossierPncObjectModel {
    number: string;
    changelog: string;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
