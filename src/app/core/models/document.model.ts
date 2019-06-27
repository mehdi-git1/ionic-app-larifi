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
    OTHER = 'OTHER'
}
