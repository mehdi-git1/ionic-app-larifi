import { ToastService } from './../toast/toast.service';
import { Injectable, ElementRef } from '@angular/core';
import { RestService } from '../../http/rest/rest.base.service';
import { UserProfileModel } from '../../models/admin/user-profile.model';
import { UserPermissionModel } from '../../models/admin/user-permission.model';
import { UrlConfiguration } from '../../configuration/url.configuration';

import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';

declare var window: any;

@Injectable()
export class PdfGeneratorService {

  constructor(private toastService: ToastService) {
  }

  /**
   * Génère un pdf correspondant à l'élément HTML en paramère
   * @param elementToPrint élément HTML
   * @param pdfFileName nom du fichier PDF généré
   */
  generatePdf(elementToPrint: HTMLElement, pdfFileName: string) {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.pdf) {
      const options = {
          name: pdfFileName,
          documentSize: 'A4',
          type: 'share',
          fileName: pdfFileName
      };
      window.cordova.plugins.pdf.fromData(elementToPrint.innerHTML, options)
      .then(result => this.toastService.info('OK'))
      .catch(err => this.toastService.error(err));
    } else {
      const opt = {
        margin: 15,
        filename: pdfFileName,
        image: {
          type: 'jpeg',
          quality: 0.98
        },
        html2canvas: {
          scale: 2 ,
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
