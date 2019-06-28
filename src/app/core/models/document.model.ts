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

export const DocumentTypeIconFileName = new Map<string, string>([
    ['IMAGE', 'picture.svg'],
    ['PDF', 'pdf.svg'],
    ['DOC', 'doc.svg'],
    ['PPT', 'ppt.svg'],
    ['XLS', 'xls.svg'],
    ['OTHER', 'doc.svg']
  ]);
