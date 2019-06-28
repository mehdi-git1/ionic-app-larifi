import { DocumentModel, DocumentTypeEnum, DocumentTypeIconFileName } from './../../../core/models/document.model';
import { DeviceService } from './../../../core/services/device/device.service';
import { Component, ViewChild, ElementRef, Input } from '@angular/core';
const iconFolderPath = 'assets/imgs/';
const imageType = 'image';
const pdfType = 'application/pdf';
const pptType = 'application/vnd.ms-powerpoint';
const pptType2 = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
const excelType = 'application/vnd.ms-excel';
const excelType2 = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const docType = 'application/msword';
const docType2 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
@Component({
  selector: 'document-manager',
  templateUrl: 'document-manager.component.html'
})
export class DocumentManagerComponent {

  /**
   * Native upload button
   */
  @ViewChild('fileUpload') private fileUpload: ElementRef;

  @Input() documents: Array<DocumentModel>;

  @Input() editMode: boolean;

  constructor() {
  }

  /**
   * Ajoute un/des document(s) à l'évènement
   * @param event évènement
   */
  addFiles(event: Event) {
    const files = this.fileUpload.nativeElement.files;
    for ( const file of files) {
      const myReader: FileReader = new FileReader();
      let content;
      myReader.onloadend = (e) => {
          content = myReader.result;
          const type = this.getFileTypeFromFile(file);
          const newDocument = new DocumentModel(file.name, type, btoa(content));
          this.documents.push(newDocument);
      };
      myReader.readAsDataURL(file);
    }
  }

  /**
   * Supprime un document de l'évènement
   * @param documentToRemove document à supprimer
   */
  removeFile(documentToRemove: DocumentModel) {
    const documentIndexToRemovethis = this.documents.indexOf(documentToRemove);
    this.documents.splice(documentIndexToRemovethis, 1);
  }

  /**
   * Récupère le type de fichier à partir du fichier
   * @param file Fichier à checker
   */
  getFileTypeFromFile(file: File): DocumentTypeEnum {
    if (file.type && file.type.startsWith(imageType)) {
      return DocumentTypeEnum.IMAGE;
    }
    if (file.type === pdfType) {
      return DocumentTypeEnum.PDF;
    }
    if (file.type === pptType) {
      return DocumentTypeEnum.PPT;
    }
    if (file.type === docType) {
      return DocumentTypeEnum.DOC;
    }
    if (file.type === excelType) {
      return DocumentTypeEnum.XLS;
    }
    return DocumentTypeEnum.OTHER;
  }

  /**
   * Récupère le chemin vers le fichier de l'icone
   * @param document document
   */
  getFileTypeIcon(document: DocumentModel) {
    return iconFolderPath + DocumentTypeIconFileName[document.type];
  }
}
