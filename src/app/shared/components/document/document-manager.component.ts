import { DocumentModel, DocumentTypeEnum } from './../../../core/models/document.model';
import { FileChooser } from '@ionic-native/file-chooser';
import { DeviceService } from './../../../core/services/device/device.service';
import { Component, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'document-manager',
  templateUrl: 'document-manager.component.html'
})
export class DocumentManagerComponent {

  /**
   * Native upload button (hidden)
   */
  @ViewChild('fileUpload') private fileUpload: ElementRef;

  @Input() documents: Array<DocumentModel>;

  @Input() editMode: boolean;

  constructor(
    public deviceService: DeviceService,
    private fileChooser: FileChooser) {
  }

  /**
   * Attache un document à l'évènement du JDB
   */
  attachFile() {
    this.fileChooser.open()
    .then(uri => console.log(uri))
    .catch(e => console.log(e));
  }

  /**
   * Ajoute un/des document(s) à l'évènement
   * @param event évènement
   */
  addFile(event: Event) {
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
   * Récupère le type de fichier en fonction du fichier
   * @param file Fichier à checker
   */
  private getFileTypeFromFile(file: File): DocumentTypeEnum {
    if (file.type.startsWith('image')) {
      return DocumentTypeEnum.IMAGE;
    }
    if (file.type === 'application/pdf') {
      return DocumentTypeEnum.PDF;
    }
    return DocumentTypeEnum.OTHER;
  }

  getFileTypeIcon(document: DocumentModel) {
    const iconFolderPath = 'assets/imgs/';
    let iconFileName = 'doc.svg';
    if (document.type === DocumentTypeEnum.PDF) {
      iconFileName = 'pdf.svg';
    } else if (document.type === DocumentTypeEnum.IMAGE) {
      iconFileName = 'picture.svg';
    }
    return iconFolderPath + iconFileName;
  }
}
