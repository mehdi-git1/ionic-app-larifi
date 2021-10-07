import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
export class AppVersionModel extends EDossierPncObjectModel {
  number: string;
  changelog: string;
  releaseDate: string;
  deprecated: boolean;

  getStorageId(): string {
    return `${this.techId}`;
  }
}
