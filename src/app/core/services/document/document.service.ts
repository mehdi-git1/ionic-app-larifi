import { DocumentModel, DocumentTypeEnum } from './../../models/document.model';
import { Injectable } from '@angular/core';
import { RestService } from '../../http/rest/rest.base.service';
import { UrlConfiguration } from '../../configuration/url.configuration';

const imageType = 'image';
const pdfType = 'application/pdf';
const pptType = 'application/vnd.ms-powerpoint';
const pptType2 = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
const excelType = 'application/vnd.ms-excel';
const excelType2 = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const docType = 'application/msword';
const docType2 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

@Injectable()
export class DocumentService {

    constructor(
        public restService: RestService,
        public config: UrlConfiguration
    ) { }

    /**
     * Récupère une eObservation à partir de son id
     * @param id l'id de l'eObservation à récupérer
     * @return une promesse contenant l'eObservation récupérée
     */
    public getDocument(documentId: number): Promise<DocumentModel> {
        return this.restService.get(this.config.getBackEndUrl('getDocumentById', [documentId]));
    }

    /**
     * Récupère le type de fichier à partir du fichier
     * @param mimeType Mime Type to check
     */
    public getFileTypeFromFile(mimeType: string): DocumentTypeEnum {
        if (mimeType && mimeType.startsWith(imageType)) {
        return DocumentTypeEnum.IMAGE;
        }
        if (mimeType === pdfType) {
        return DocumentTypeEnum.PDF;
        }
        if (mimeType === pptType || mimeType === pptType2) {
        return DocumentTypeEnum.PPT;
        }
        if (mimeType === docType || mimeType === docType2) {
        return DocumentTypeEnum.DOC;
        }
        if (mimeType === excelType || mimeType === excelType2) {
        return DocumentTypeEnum.XLS;
        }
        return DocumentTypeEnum.OTHER;
    }

    /**
     * Vérifie si le type de document est prévisualisable
     * @param type type de document
     * @return true si le document est de type image ou pdf
     */
    isPreviewable(type: DocumentTypeEnum): boolean {
        return type === DocumentTypeEnum.IMAGE || type === DocumentTypeEnum.PDF;
    }
}
