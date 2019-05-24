import { Component, Input} from '@angular/core';
import { PdfGeneratorService } from '../../../core/services/pdf-generator/pdf-generator.service';

@Component({
  selector: 'pdf-button',
  templateUrl: 'pdf-button.component.html'
})
export class PdfButtonComponent {

  @Input() pdfFileName: string;

  @Input() elementToPrint: HTMLElement;

  constructor(private pdfGeneratorService: PdfGeneratorService) {
  }

  /**
   * Génère le pdf
   */
  generatePdf() {
    this.pdfGeneratorService.generatePdf(this.elementToPrint, this.pdfFileName);
  }

 }
