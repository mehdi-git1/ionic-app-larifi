import { DocumentModel } from 'src/app/core/models/document.model';

import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';

export class ProfessionalInterviewItemModel extends EDossierPncObjectModel {

    id: number;
    itemOrder: number;
    key: string;
    label: string;
    value: string;
    referentialItemId: number;
    attachmentFiles: Array<DocumentModel> = new Array();

    getStorageId(): string {
        return `${this.techId}`;
    }
}
