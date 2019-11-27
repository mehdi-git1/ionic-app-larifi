import { Component, Input } from '@angular/core';

import { DeviceService } from '../../../core/services/device/device.service';
import { PdfGeneratorService } from '../../../core/services/pdf-generator/pdf-generator.service';

@Component({
  selector: 'pdf-button',
  templateUrl: 'pdf-button.component.html',
  styleUrls: ['./pdf-button.component.scss']
})
export class PdfButtonComponent {

  @Input() pdfFileName: string;

  @Input() pncCard: HTMLElement;

  @Input() elementToPrint: HTMLElement;

  constructor(
    private pdfGeneratorService: PdfGeneratorService,
    private deviceService: DeviceService) {
  }

  /**
   * Génère le pdf
   */
  generatePdf() {
    let element = '<div>';
    if (this.pncCard) {
      element += this.pncCard.innerHTML;
    }
    if (this.elementToPrint) {
      element += this.elementToPrint.innerHTML + '</div>';
    }
    this.pdfGeneratorService.generatePdfFromHtmlString(element, this.pdfFileName);
  }

  /**
   * Vérifie que le bouton est disponible sur cette plateforme
   */
  isAvailable() {
    if (this.deviceService.isBrowser()) {
      return true;
    } else {
      return false;
    }
  }
}
