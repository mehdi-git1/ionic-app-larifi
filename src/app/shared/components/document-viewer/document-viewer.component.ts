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
            this.documentService.getDocument(document.id).then(documentResult => {
              if (document.type === DocumentTypeEnum.IMAGE) {
                this.base64FileContentAndType = this.domSanitizer.bypassSecurityTrustResourceUrl('data:' + documentResult.mimeType + ';base64,' + documentResult.content);
              } else if (document.type === DocumentTypeEnum.PDF) {
                this.viewController.dismiss();
                this.fileService.displayFile(FileTypeEnum.PDF, this.base64FiletoUrl(documentResult.content));
              } else {
                this.previewUnavailable();
              }
            }).catch(err => {
                this.previewUnavailable();
            });
        } else {
            this.previewUnavailable();
        }
    }
  }

  isImageType() {
    return this.type === DocumentTypeEnum.IMAGE;
  }

  /**
   * Transforme un fichier en base64 en url de type blob
   * @param base64File fichier en base64
   */
  base64FiletoUrl(base64File: string): string {
    let previewSrc;
    try {
      if (base64File) {
        const file = new Blob([Utils.base64ToArrayBuffer(base64File)], { type: 'application/pdf' });
        previewSrc = URL.createObjectURL(file);
      } else {
        previewSrc = null;
      }
    } catch (error) {
      console.error('createObjectURL error:' + error);
    }
    return previewSrc;
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
      return this.base64FileContentAndType && this.base64FileContentAndType !== undefined;
  }

}
