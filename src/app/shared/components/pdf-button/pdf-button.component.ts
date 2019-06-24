import { DeviceService } from './../../../core/services/device/device.service';
import { Component, Input} from '@angular/core';
import { PdfGeneratorService } from '../../../core/services/pdf-generator/pdf-generator.service';

@Component({
  selector: 'pdf-button',
  templateUrl: 'pdf-button.component.html'
})
export class PdfButtonComponent {

  @Input() pdfFileName: string;

  @Input() elementToPrint: HTMLElement;

  constructor(private pdfGeneratorService: PdfGeneratorService,
    private deviceService: DeviceService) {
  }

  /**
   * Génère le pdf
   */
  generatePdf() {
    this.pdfGeneratorService.generatePdf(this.elementToPrint, this.pdfFileName);
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
