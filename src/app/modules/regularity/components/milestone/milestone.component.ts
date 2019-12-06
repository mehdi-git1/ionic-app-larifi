import { FileService } from 'src/app/core/file/file.service';
import { PdfService } from 'src/app/core/file/pdf/pdf.service';
import { DocumentModel } from 'src/app/core/models/document.model';
import { PncModel } from 'src/app/core/models/pnc.model';
import { ConnectivityService } from 'src/app/core/services/connectivity/connectivity.service';
import { DeviceService } from 'src/app/core/services/device/device.service';
import { DocumentService } from 'src/app/core/services/document/document.service';
import { PncService } from 'src/app/core/services/pnc/pnc.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tab-milestone',
  templateUrl: './milestone.component.html',
  styleUrls: ['./milestone.component.scss'],
})
export class MilestoneComponent implements OnInit {

  matricule: string;
  pnc: PncModel;
  milestonePdf: DocumentModel;

  constructor(
    private pncService: PncService,
    private activatedRoute: ActivatedRoute,
    private deviceService: DeviceService,
    private documentService: DocumentService,
    private pdfService: PdfService,
    private connectivityService: ConnectivityService,
    private fileService: FileService
  ) { }

  ngOnInit() {
    this.matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
    this.pncService.getPnc(this.matricule).then(
      pnc => {
        this.pnc = pnc;
        this.pnc.documents.forEach(document => {
          if (document.fileName.includes('JALONS')) {
            this.milestonePdf = document;
          }
        });
      }
    );
  }

  /**
   * Vérifie que l'on est en mode connecté
   * @return true si on est en mode connecté, false sinon
   */
  isConnected(): boolean {
    return this.connectivityService.isConnected();
  }

  /**
   * Ouvre le pdf Relevé de régularité individuel.
   */
  openMilestone() {
    if (this.milestonePdf) {
      this.documentService.getDocument(this.milestonePdf.id).then(documentResult => {
        if (this.deviceService.isBrowser()) {
          this.fileService.downloadFile(documentResult.mimeType, documentResult.fileName, documentResult.content);
        } else {
          this.pdfService.displayPDFFromBase64(documentResult.content, documentResult.fileName);
        }
      });
    }
  }

}
