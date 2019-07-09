import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { DocumentModel, DocumentTypeEnum } from '../../../core/models/document.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavParams, ViewController, AlertController } from 'ionic-angular';
import { DocumentService } from '../../../core/services/document/document.service';
import { PdfService } from '../../../core/file/pdf/pdf.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { FileService } from '../../../core/file/file.service';
import { FileTypeEnum } from '../../../core/enums/file-type.enum';
import { Utils } from '../../utils/utils';


@Component({
  selector: 'document-viewer',
  templateUrl: 'document-viewer.component.html'
})
export class DocumentViewerComponent {
    DocumentTypeEnum = DocumentTypeEnum;
    documentFile: File;
    type: DocumentTypeEnum;
    base64FileContent: SafeUrl;
    base64FileContentAndType: SafeUrl;
    @ViewChild('imageViewer') imageViewer: ElementRef;

  constructor(private domSanitizer: DomSanitizer, private navParams: NavParams, private viewController: ViewController,
    private documentService: DocumentService, private pdfService: PdfService, private toastService: ToastService, private translateService: TranslateService, private fileService: FileService) {
    const document: DocumentModel = this.navParams.get('document');
    this.document = document;
  }

  @Input()
  set document(document: DocumentModel) {
      this.type = document.type;
    if (document && document.id) {
        if (this.isPreviewable(document.type)) {
          if (document.content) {
            this.displayDocument(document);
          } else {
            this.documentService.getDocument(document.id).then(documentResult => {
              document.content = documentResult.content;
              this.displayDocument(documentResult);
            }).catch(err => {
                this.previewUnavailable();
            });
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
  displayDocument(document: DocumentModel) {
    if (document.type === DocumentTypeEnum.IMAGE) {
      this.base64FileContentAndType = this.domSanitizer.bypassSecurityTrustResourceUrl('data:' + document.mimeType + ';base64,' + document.content);
    } else if (document.type === DocumentTypeEnum.PDF) {
      this.viewController.dismiss();
      this.fileService.displayFile(FileTypeEnum.PDF, this.fileService.base64FiletoUrl(document.content, document.mimeType));
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
  private previewUnavailable()  {
    this.viewController.dismiss();
    this.toastService.warning(this.translateService.instant('GLOBAL.DOCUMENT.PREVIEW_NOT_AVAILABLE'));
  }

  /**
   * Ferme le viewer
   */
  closeDocumentViewer() {
    this.viewController.dismiss();
  }

  /**
   * Vérifie que le contenu de la visionneuse est chargé
   * @return true si le contenu est chargé, false sinon
   */
  loadingIsOver(): boolean {
      return this.base64FileContentAndType && this.base64FileContentAndType !== undefined;
  }

}
