import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';

export class MyBoardNotificationSummaryModel extends EDossierPncObjectModel {
  matricule: string;
  totalFiltered: number;
  totalArchived: number;

  getStorageId(): string {
    return `${this.matricule}`;
  }
}