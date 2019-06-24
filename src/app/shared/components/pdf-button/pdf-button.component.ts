import { DeviceService } from './../../../core/services/device/device.service';
import { Component, Input, Renderer2 } from '@angular/core';
import { PdfGeneratorService } from '../../../core/services/pdf-generator/pdf-generator.service';

@Component({
  selector: 'pdf-button',
  templateUrl: 'pdf-button.component.html'
})
export class PdfButtonComponent {

  @Input() pdfFileName: string;

  @Input() pncCard: HTMLElement;

  @Input() elementToPrint: HTMLElement;

  constructor(private pdfGeneratorService: PdfGeneratorService,
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
   * Vérifie que le bouton est disponible pour la platform
   */
  isAvailable() {
    if ( this.deviceService.isBrowser()) {
      return true;
    } else {
      return false;
    }
  }
 }
