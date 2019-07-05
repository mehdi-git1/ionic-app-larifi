import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { DocumentModel, DocumentTypeEnum } from '../../../core/models/document.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavParams, ViewController, AlertController } from 'ionic-angular';
import { DocumentService } from '../../../core/services/document/document.service';
import { PdfService } from '../../../core/file/pdf/pdf.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';


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
    private documentService: DocumentService, private pdfService: PdfService, private toastService: ToastService, private translateService: TranslateService) {
    const document: DocumentModel = this.navParams.get('document');
    this.document = document;
  }

  @Input()
  set document(document: DocumentModel) {
      this.type = document.type;
    if (document && document.id) {
        if (this.isPreviewable(document.type)) {
            this.documentService.getDocument(document.id).then(documentResult => {
              this.base64FileContentAndType = this.domSanitizer.bypassSecurityTrustResourceUrl('data:' + documentResult.mimeType + ';base64,' + documentResult.content);
              this.base64FileContent = documentResult.content;
            }).catch(err => {
                this.previewUnavailable();
            });
        } else {
            this.previewUnavailable();
        }
    }
  }

  /**
   * Vérifie si le type de document est prévisualisable
   * @param type type de document
   * @return true si le document est de type image ou pdf
   */
  private isPreviewable(type: DocumentTypeEnum): boolean {
    return type === DocumentTypeEnum.IMAGE || type === DocumentTypeEnum.PDF;
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

  loadingIsOver(): boolean {
      return this.base64FileContent && this.base64FileContent !== undefined;
  }

}
