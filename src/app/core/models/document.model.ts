export class DocumentModel {

    fileName: string;
    creationDate: Date;
    content: string;
    type: DocumentTypeEnum;

    constructor(fileName: string, type: DocumentTypeEnum, content: string, creationDate: Date = new Date()) {
        this.fileName = fileName;
        this.content = content;
        this.creationDate = creationDate;
        this.type = type;
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

export const DocumentTypeIconFileName = new Map<DocumentTypeEnum, string>([
    [DocumentTypeEnum.IMAGE, 'picture.svg'],
    [DocumentTypeEnum.PDF, 'pdf.svg'],
    [DocumentTypeEnum.DOC, 'doc.svg'],
    [DocumentTypeEnum.PPT, 'ppt.svg'],
    [DocumentTypeEnum.XLS, 'xls.svg'],
    [DocumentTypeEnum.OTHER, 'doc.svg']
  ]);
