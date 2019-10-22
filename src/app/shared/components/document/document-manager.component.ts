import { AlertController, PopoverController } from 'ionic-angular';

import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { FileService } from '../../../core/file/file.service';
import { DocumentModel, DocumentTypeIconFileName } from '../../../core/models/document.model';
import { ConnectivityService } from '../../../core/services/connectivity/connectivity.service';
import { DeviceService } from '../../../core/services/device/device.service';
import { DocumentService } from '../../../core/services/document/document.service';
import { SessionService } from '../../../core/services/session/session.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { DocumentViewerComponent } from '../document-viewer/document-viewer.component';

const iconFolderPath = 'assets/imgs/';
const BASE_64 = 'base64,';
const DEFAULT_FILES_MAX_SIZE = 25000000;
@Component({
  selector: 'document-manager',
  templateUrl: 'document-manager.component.html'
})
export class DocumentManagerComponent {

  /**
   * Native upload button
   */
  @ViewChild('fileUpload') private fileUpload: ElementRef;

  _documents: Array<DocumentModel>;

  @Input() readonly: boolean;

  loading = false;
  filesMaxSize = DEFAULT_FILES_MAX_SIZE;
  filesSize = 0;

  @Input() set documents(documents: Array<DocumentModel>) {
    for (const document of documents) {
      this.filesSize += document.fileSize;
    }
    this._documents = documents;
  }
  get documents(): Array<DocumentModel> {
    return this._documents;
  }
  constructor(public popoverCtrl: PopoverController,
    private documentService: DocumentService,
    private fileService: FileService,
    private deviceService: DeviceService,
    private connectivityService: ConnectivityService,
    private alertCtrl: AlertController,
    private translateService: TranslateService,
    private toastService: ToastService,
    private sessionService: SessionService) {
    this.filesMaxSize = this.sessionService.getActiveUser().appInitData.attachmentsMaxSize;
  }

  getFilesMaxSizeInMo() {
    return Math.round(this.filesMaxSize / 1000000);
  }

  /**
   * Calcule le pourcentage de la taille actuelle des fichiers en fonction de la taille maximum autorisée
   */
  getDocumentsSizePercent(): number {

    if (this.filesSize === 0) {
      return 0;
    }
    return this.filesSize / this.filesMaxSize * 100;
  }

  /**
   * Ajoute un/des document(s) à l'évènement
   * @param event évènement
   */
  addFiles(event: Event) {
    const files = this.fileUpload.nativeElement.files;
    // Cas d'un ajout multiple. Si la taille de tous les fichiers fait dépasser la limite, on rejette et notifie l'utilisateur
    if (files && files.length > 1) {
      let addedFilesFullSize = 0;
      for (const file of files) {
        addedFilesFullSize += file.size;
      }
      if (this.filesSize + addedFilesFullSize > this.filesMaxSize) {
        this.toastService.warning(this.translateService.instant('GLOBAL.DOCUMENT.ERROR_MULTI_MAX_FILES_SIZE_REACHED', { maxSize: this.getFilesMaxSizeInMo() }));
        return;
      }
    }
    for (const file of files) {
      if (this.filesSize + file.size > this.filesMaxSize) {
        this.toastService.warning(this.translateService.instant('GLOBAL.DOCUMENT.ERROR_MAX_FILES_SIZE_REACHED', { fileName: file.name, maxSize: this.getFilesMaxSizeInMo() }));
      } else {
        const myReader: FileReader = new FileReader();
        let content;
        myReader.onloadend = (e) => {
          content = myReader.result;
          const base64Index = content.indexOf(BASE_64);
          const base64Content = content.substring(base64Index + BASE_64.length, content.length);
          const type = this.documentService.getDocumentTypeFromMimeType(file.type);
          const newDocument = new DocumentModel(file.name, type, file.type, base64Content, file.size);
          this._documents.push(newDocument);
          this.filesSize += file.size;
        };
        myReader.readAsDataURL(file);
      }
    }
    this.fileUpload.nativeElement.value = null;
  }

  /**
   * Supprime un document de l'évènement
   * @param documentToRemove document à supprimer
   */
  removeFile(documentToRemove: DocumentModel) {
    const fileSize = documentToRemove.fileSize;
    const documentIndexToRemovethis = this._documents.indexOf(documentToRemove);
    this._documents.splice(documentIndexToRemovethis, 1);
    this.filesSize -= fileSize;
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
    if (!this.connectivityService.isConnected()) {
      this.visualizationUnavailablePopup();
    }
    if (this.documentService.isPreviewable(document.type) && this.deviceService.isBrowser()) {
      const popover = this.popoverCtrl.create(DocumentViewerComponent, { document: document }, { cssClass: 'document-viewer-popover' });
      popover.present({});
    } else {
      this.loading = true;
      if (!document.content) {
        this.documentService.getDocument(document.id).then(documentResult => {
          document.content = documentResult.content;
          this.fileService.downloadFile(documentResult.mimeType, documentResult.fileName, documentResult.content);
          this.loading = false;
        }).catch((error) => {
          this.loading = false;
        });
      } else {
        this.fileService.downloadFile(document.mimeType, document.fileName, document.content);
        this.loading = false;
      }
    }
  }

  /**
   * Popup d'avertissement en cas de visualisation de pieces jointes en déconnecté.
   */
  visualizationUnavailablePopup() {
    return new Promise((resolve, reject) => {
      this.alertCtrl.create({
        title: this.translateService.instant('CONGRATULATION_LETTER_DETAIL.ATTACHMENT_FILES.VISUALIZATION_UNAVAILABLE.TITLE'),
        message: this.translateService.instant('CONGRATULATION_LETTER_DETAIL.ATTACHMENT_FILES.VISUALIZATION_UNAVAILABLE.MESSAGE'),
        buttons: [
          {
            text: this.translateService.instant('GLOBAL.BUTTONS.OK'),
            handler: () => resolve()
          }
        ]
      }).present();
    });
  }
}
