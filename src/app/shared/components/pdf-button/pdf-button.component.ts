import { ToastService } from './../../../core/services/toast/toast.service';
import { Component, Input, ElementRef } from '@angular/core';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PdfGeneratorService } from '../../../core/services/pdf-generator/pdf-generator.service';

declare var window: any;
window.html2canvas = html2canvas;
@Component({
  selector: 'pdf-button',
  templateUrl: 'pdf-button.component.html'
})
export class PdfButtonComponent {

  @Input() pdfFileName: string;

  @Input() elementToPrint: HTMLElement;

  constructor(private toastService: ToastService,
              private pdfGeneratorService: PdfGeneratorService) {
  }

  /**
   * Génère le pdf
   */
  generatePdf() {
    this.pdfGeneratorService.generatePdf(this.elementToPrint, this.pdfFileName);
  }

 }
