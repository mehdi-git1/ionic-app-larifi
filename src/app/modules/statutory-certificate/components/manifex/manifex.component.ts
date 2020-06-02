import { FileTypeEnum } from 'src/app/core/enums/file-type.enum';
import { FileService } from 'src/app/core/file/file.service';

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ManifexLightModel } from '../../../../core/models/manifex/manifex-light.model';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { ManifexService } from '../../../../core/services/manifex/manifex.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { StatutoryCertificateDisplayTypeEnum } from 'src/app/core/enums/statutory-certificate-display-type.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'pnc-manifex',
  templateUrl: './manifex.component.html',
  styleUrls: ['./manifex.component.scss'],
})
export class ManifexComponent implements OnInit {

  @Input() manifexCreationDate: Date;
  @Input() manifexDeletionDate: Date;
  @Input() title: string;
  @Input() displayType: StatutoryCertificateDisplayTypeEnum;

  matricule: string;
  formatedManifexData;
  manifexDisplayedData;
  loadingPdf: boolean;
  manifexService: any;
  manifex: any;
  fileService: any;
  sessionService: any;
  connectivityService: any;
  constructor(private translateService: TranslateService) {
  }

  ngOnInit() {
    this.formatedManifexData = { creationDate: new Array(), deletionDate: new Array() };
    if (this.manifexCreationDate) {
      this.formatedManifexData.creationDate.push(this.manifexCreationDate);
    }
    if (this.manifexDeletionDate) {
      this.formatedManifexData.deletionDate.push(this.manifexDeletionDate);
    }
    this.manifexDisplayedData = {
      headers: [this.translateService.instant('STATUTORY_CERTIFICATE.MANIFEX.CREATION_DATE'),
      this.translateService.instant('STATUTORY_CERTIFICATE.MANIFEX.DELETION_DATE')],
      values: this.manifexCreationDate ? [
        {
          value: this.formatedManifexData.creationDate, type: 'date'
        },
        {
          value: this.manifexDeletionDate ? this.formatedManifexData.deletionDate : null, type: 'date'
        }
      ] : null
    };
  }
  /**
   * Télécharge et ouvre le PDF de la fiche manifex du PNC
   */
  openPdfManifex() {
    this.loadingPdf = true;
    this.manifexService.downloadManifexPdf(this.manifex.techId).then(manifexPdf => {
      this.loadingPdf = false;
      this.fileService.displayFile(FileTypeEnum.PDF, this.fileService.base64FiletoUrl(manifexPdf.pdf, 'application/pdf'));
    }, error => {
      this.loadingPdf = false;
    });
  }

  /**
   * Vérifie si l'utilisateur peut ouvrir la fiche Manifex. Seul le PNC concerné par la fiche peut l'ouvrir
   * @return vrai si c'est le cas, faux sinon
   */
  canOpenManifexPdf(): boolean {
    return this.matricule === this.sessionService.getActiveUser().matricule && this.connectivityService.isConnected();
  }

  /**
   * Verifie qu'un pnc n'a jamais eu de fiche manifex
   * @return true si pnc n'a jamais eu fiche, false sinon.
   */
  public pncNeverHadManifex(): boolean {
    return !(this.manifex || this.manifexCreationDate);
  }

  /**
   * Récupère la date de création de la fiche manifex
   *
   * @return la date de création de la fiche manifex
   */
  getManifexCreationDate(): Date {
    return (this.manifex ? this.manifex.creationDate : this.manifexCreationDate);
  }
}
