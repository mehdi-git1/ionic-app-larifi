import { DeviceService } from './../device/device.service';
import { ToastService } from './../toast/toast.service';
import { Injectable, ElementRef } from '@angular/core';
import { RestService } from '../../http/rest/rest.base.service';
import { UserProfileModel } from '../../models/admin/user-profile.model';
import { UserPermissionModel } from '../../models/admin/user-permission.model';
import { UrlConfiguration } from '../../configuration/url.configuration';
import * as _ from 'lodash';

// import * as jsPDF from 'jspdf';
// import html2pdf from 'html2pdf.js';

declare var cordova: any;

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
  generatePdf(elementToPrint: HTMLElement, pdfFileName: string) {
    /*
    if (!this.deviceService.isBrowser() && cordova && cordova.plugins && cordova.plugins.pdf) {
      const options = {
          name: pdfFileName,
          documentSize: 'A4',
          type: 'share',
          fileName: pdfFileName
      };
      const payload = _.template('<head><link rel="stylesheet" href="<%=css_file%>"></head>' + elementToPrint.innerHTML);

      cordova.plugins.pdf.fromData(payload({css_file : this.cssFile}), options)
      .then()
      .catch(err => this.toastService.error(err));
    } else  {
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
    */
  }
}
