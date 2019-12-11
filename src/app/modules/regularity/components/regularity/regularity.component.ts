import { TabHeaderEnum } from 'src/app/core/enums/tab-header.enum';
import { FileService } from 'src/app/core/file/file.service';
import { HtmlService } from 'src/app/core/file/html/html.service';
import { PdfService } from 'src/app/core/file/pdf/pdf.service';
import { AppParameterModel } from 'src/app/core/models/app-parameter.model';
import { DocumentModel } from 'src/app/core/models/document.model';
import { PncModel } from 'src/app/core/models/pnc.model';
import { ConnectivityService } from 'src/app/core/services/connectivity/connectivity.service';
import { DeviceService } from 'src/app/core/services/device/device.service';
import { DocumentService } from 'src/app/core/services/document/document.service';
import { PncService } from 'src/app/core/services/pnc/pnc.service';
import { SessionService } from 'src/app/core/services/session/session.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tab-regularity',
  templateUrl: './regularity.component.html',
  styleUrls: ['./regularity.component.scss'],
})
export class RegularityComponent implements OnInit {

  matricule: string;
  pnc: PncModel;
  tabHeaderEnum: TabHeaderEnum = TabHeaderEnum.ACTIVITY_PAGE;
  regularityLinks: Array<AppParameterModel>;
  absIndividuelPdf: DocumentModel;

  constructor(
    private pncService: PncService,
    private activatedRoute: ActivatedRoute,
    private deviceService: DeviceService,
    private documentService: DocumentService,
    private sessionService: SessionService,
    private pdfService: PdfService,
    private connectivityService: ConnectivityService,
    private htmlService: HtmlService,
    private fileService: FileService) { }

  ngOnInit() {
    this.matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
    this.pncService.getPnc(this.matricule).then(
      pnc => {
        this.pnc = pnc;
        this.pnc.documents.forEach(document => {
          if (document.fileName.includes('Releve_AbsIndividuel')) {
            this.absIndividuelPdf = document;
          }
        });
      }
    );
    this.regularityLinks = this.sessionService.getActiveUser().appInitData.regularityLinks;
  }

  /**
   * Verifie si on est en mode Web
   */
  isBrowser() {
    return this.deviceService.isBrowser();
  }

  /**
   * Ouvre/télécharge (mode web) le pdf Relevé de régularité individuel.
   */
  openIndividualRegularityStatement() {
    if (this.absIndividuelPdf) {
      this.documentService.getDocument(this.absIndividuelPdf.id).then(documentResult => {
        if (this.isBrowser()) {
          this.fileService.downloadFile(documentResult.mimeType, documentResult.fileName, documentResult.content);
        } else {
          this.pdfService.displayPDFFromBase64(documentResult.content, documentResult.fileName);
        }
      });
    }
  }

  /**
   * Vérifie que l'on est en mode connecté
   * @return true si on est en mode connecté, false sinon
   */
  isConnected(): boolean {
    return this.connectivityService.isConnected();
  }

  /**
   * redirige vers un lien
   * extere à l'appli
   *
   * @param externalUrl url destination
   */
  gotoLink(externalUrl: string) {
    if (externalUrl) {
      this.htmlService.displayHTML(externalUrl.replace('%MATRICULE%', this.pnc.matricule));
    }
  }
}
