import { DocumentModel } from '../document.model';
import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { PncLightModel } from '../pnc-light.model';
import { HrDocumentCategory } from './hr-document-category';

export class HrDocumentModel extends EDossierPncObjectModel {

    pnc: PncLightModel;
    redactor: PncLightModel;
    creationDate: Date;
    lastUpdateDate: Date;
    lastUpdateAuthor: PncLightModel;
    category: HrDocumentCategory;
    title: string;
    content: string;
    attachmentFiles: Array<DocumentModel> = new Array();
    deleted: boolean;

    getStorageId(): string {
        return `${this.techId}`;
    }

}
