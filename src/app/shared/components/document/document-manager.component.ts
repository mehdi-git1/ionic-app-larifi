import { DocumentModel, DocumentTypeEnum, DocumentTypeIconFileName } from './../../../core/models/document.model';
import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { PopoverController } from 'ionic-angular';

const iconFolderPath = 'assets/imgs/';
const BASE_64 = 'base64,';

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

  constructor(public popoverCtrl: PopoverController) {
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
          const base64Index = content.indexOf(BASE_64);
          const base64Content = content.substring(base64Index + BASE_64.length, content.length);
          const newDocument = new DocumentModel(file.name, file.type, base64Content);
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
   * Récupère le chemin vers le fichier de l'icone
   * @param document document
   */
  getFileTypeIcon(document: DocumentModel) {
    return iconFolderPath + DocumentTypeIconFileName.get(document.type);
  }

}
