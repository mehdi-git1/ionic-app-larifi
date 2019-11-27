import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavParams, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { FileTypeEnum } from '../../../core/enums/file-type.enum';
import { FileService } from '../../../core/file/file.service';
import { DocumentModel, DocumentTypeEnum } from '../../../core/models/document.model';
import { DocumentService } from '../../../core/services/document/document.service';
import { ToastService } from '../../../core/services/toast/toast.service';

@Component({
  selector: 'document-viewer',
  templateUrl: 'document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss']
})
export class DocumentViewerComponent {
  DocumentTypeEnum = DocumentTypeEnum;
  documentFile: File;
  type: DocumentTypeEnum;
  base64FileContent: SafeUrl;
  base64FileContentAndType: SafeUrl;
  @ViewChild('imageViewer', { static: false }) imageViewer: ElementRef;

  constructor(
    private domSanitizer: DomSanitizer,
    private navParams: NavParams,
    private popoverCtrl: PopoverController,
    private documentService: DocumentService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private fileService: FileService) {
    const document: DocumentModel = this.navParams.get('document');
    this.document = document;
  }

  @Input()
  set document(document: DocumentModel) {
    this.type = document.type;
    if (document) {
      if (this.isPreviewable(document.type)) {
        if (document.content) {
          this.displayDocument(document);
        } else if (document.id) {
          this.documentService.getDocument(document.id).then(documentResult => {
            document.content = documentResult.content;
            this.displayDocument(documentResult);
          }).catch(err => {
            this.previewUnavailable();
          });
        } else {
          this.previewUnavailable();
        }
      } else {
        this.previewUnavailable();
      }
    }
  }

  /**
   * Affiche le document
   * @param document le document à afficher
   */
  async displayDocument(document: DocumentModel) {
    if (document.type === DocumentTypeEnum.IMAGE) {
      this.base64FileContentAndType = this.domSanitizer
        .bypassSecurityTrustResourceUrl('data:' + document.mimeType + ';base64,' + document.content);
    } else if (document.type === DocumentTypeEnum.PDF) {
      await this.popoverCtrl.dismiss();
      this.fileService.displayFile(FileTypeEnum.PDF, this.fileService.base64FiletoUrl(document.content, document.mimeType))
    } else {
      this.previewUnavailable();
    }
  }

  /**
   * Vérifie que le document est de type image
   * @return true si le document est de type image, false sinon
   */
  isImageType() {
    return this.type === DocumentTypeEnum.IMAGE;
  }

  /**
   * Vérifie si le type de document est prévisualisable
   * @param type type de document
   * @return true si le document est de type image ou pdf
   */
  private isPreviewable(type: DocumentTypeEnum): boolean {
    return this.documentService.isPreviewable(type);
  }

  /**
   * Affiche un message de prévisualiation non disponible
   */
  private async previewUnavailable() {
    await this.popoverCtrl.dismiss();
    this.toastService.warning(this.translateService.instant('GLOBAL.DOCUMENT.PREVIEW_NOT_AVAILABLE'));
  }

  /**
   * Ferme le viewer
   */
  async closeDocumentViewer() {
    await this.popoverCtrl.dismiss();
  }

  /**
   * Vérifie que le contenu de la visionneuse est chargé
   * @return true si le contenu est chargé, false sinon
   */
  loadingIsOver(): boolean {
    return this.base64FileContentAndType && this.base64FileContentAndType !== undefined;
  }

}
