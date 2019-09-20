export class DocumentModel {

    id: number;
    fileName: string;
    creationDate: Date;
    content: string;
    mimeType: string;
    type: DocumentTypeEnum;
    size: number;

    constructor(fileName: string, type: DocumentTypeEnum, mimeType: string, content: string, size:number, creationDate: Date = new Date()) {
        this.fileName = fileName;
        this.content = content;
        this.creationDate = creationDate;
        this.mimeType = mimeType;
        this.type =  type;
        this.size = size;
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
