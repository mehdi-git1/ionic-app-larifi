const imageType = 'image';
const pdfType = 'application/pdf';
const pptType = 'application/vnd.ms-powerpoint';
const pptType2 = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
const excelType = 'application/vnd.ms-excel';
const excelType2 = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const docType = 'application/msword';
const docType2 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export class DocumentModel {

    id: number;
    fileName: string;
    creationDate: Date;
    content: string;
    mimeType: string;
    type: DocumentTypeEnum;

    constructor(fileName: string, mimeType: string, content: string, creationDate: Date = new Date()) {
        this.fileName = fileName;
        this.content = content;
        this.creationDate = creationDate;
        this.mimeType = mimeType;
        this.type =  this.getFileTypeFromFile(mimeType);
    }

   /**
   * Récupère le type de fichier à partir du fichier
   * @param mimeType Mime Type to check
   */
  private getFileTypeFromFile(mimeType: string): DocumentTypeEnum {
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
}

export enum DocumentTypeEnum {
    IMAGE = 'IMAGE',
    PDF = 'PDF',
    DOC = 'DOC',
    PPT = 'PPT',
    XLS = 'XLS',
    OTHER = 'OTHER'

}

export const DocumentTypeIconFileName = new Map<string, string>([
    ['IMAGE', 'picture.svg'],
    ['PDF', 'pdf.svg'],
    ['DOC', 'doc.svg'],
    ['PPT', 'ppt.svg'],
    ['XLS', 'xls.svg'],
    ['OTHER', 'other.svg']
  ]);
