import { DeviceService } from './../device/device.service';
import { ToastService } from './../toast/toast.service';
import { Injectable, ElementRef } from '@angular/core';
import { RestService } from '../../http/rest/rest.base.service';
import { UserProfileModel } from '../../models/admin/user-profile.model';
import { UserPermissionModel } from '../../models/admin/user-permission.model';
import { UrlConfiguration } from '../../configuration/url.configuration';
import * as _ from 'lodash';

declare var cordova: any;
declare var jsPDF;
declare var html2pdf;

@Injectable()
export class PdfGeneratorService {

  private cssFile = 'www/build/main.css';

  constructor(private toastService: ToastService,
    private deviceService: DeviceService) {
  }

  /**
   * Génère un pdf correspondant à l'élément HTML en paramètre
   * @param elementToPrint élément HTML
   * @param pdfFileName nom du fichier PDF généré
   */
  generatePdfFromHTMLElement(elementToPrint: HTMLElement, pdfFileName: string) {
    this.generatePdf(elementToPrint, pdfFileName);
  }

  /**
   * Génère un pdf correspondant à l'élément HTML en paramètre
   * @param elementToPrint élément HTML
   * @param pdfFileName nom du fichier PDF généré
   */
  generatePdfFromHtmlString(elementToPrint: string, pdfFileName: string) {
    this.generatePdf(elementToPrint, pdfFileName);
  }


  private generatePdf(elementToPrint: any, pdfFileName: string) {
    if (this.deviceService.isBrowser()) {
      const opt = {
        margin: 15,
        filename: pdfFileName,
        image: {
          type: 'jpeg',
          quality: 0.98
        },
        html2canvas: {
          scale: 2,
          dpi: 300,
          letterRendering: true,
          useCORS: true
        },
        jsPDF: {
          unit: 'pt',
          format: 'a4',
          orientation: 'portrait'
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy']
        }
      };
      html2pdf().from(elementToPrint).set(opt).save();
    }
  }
}
