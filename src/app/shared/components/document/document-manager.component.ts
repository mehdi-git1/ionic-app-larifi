import { DocumentModel, DocumentTypeEnum, DocumentTypeIconFileName } from './../../../core/models/document.model';
import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { PopoverController } from 'ionic-angular';
import { DocumentViewerComponent } from '../document-viewer/document-viewer.component';
import { DocumentService } from '../../../core/services/document/document.service';
import { FileService } from '../../../core/file/file.service';
import { DeviceService } from '../../../core/services/device/device.service';

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

  loading = false;

  constructor(public popoverCtrl: PopoverController,
    private documentService: DocumentService,
    private fileService: FileService,
    private deviceService: DeviceService) {
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
          const type = this.documentService.getDocumentTypeFromMimeType(file.type);
          const newDocument = new DocumentModel(file.name, type, file.type, base64Content);
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
   * @return le chemin vers le fichier de l'icone
   */
  getFileTypeIcon(document: DocumentModel) {
    return iconFolderPath + DocumentTypeIconFileName.get(document.type);
  }

  /**
   * Ouvre la visionneuse de document
   * @param document document à visionner
   */
  openDocument(document: DocumentModel) {
    if (this.documentService.isPreviewable(document.type) && this.deviceService.isBrowser()) {
      const popover = this.popoverCtrl.create(DocumentViewerComponent, { document: document }, { cssClass: 'document-viewer-popover' });
      popover.present({ });
    } else {
      this.loading = true;
      if (!document.content) {
        this.documentService.getDocument(document.id).then(documentResult => {
          document.content = documentResult.content;
          this.fileService.downloadFile(documentResult.mimeType, documentResult.fileName, documentResult.content);
          this.loading = false;
        }).catch((error) => {this.loading = false;});
      } else {
        this.fileService.downloadFile(document.mimeType, document.fileName, document.content);
        this.loading = false;
      }
    }
  }
}
