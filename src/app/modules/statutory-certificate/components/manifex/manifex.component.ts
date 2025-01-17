import { FileTypeEnum } from 'src/app/core/enums/file-type.enum';
import { FileService } from 'src/app/core/file/file.service';

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ManifexLightModel } from '../../../../core/models/manifex/manifex-light.model';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { ManifexService } from '../../../../core/services/manifex/manifex.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';

@Component({
  selector: 'pnc-manifex',
  templateUrl: './manifex.component.html',
  styleUrls: ['./manifex.component.scss'],
})
export class ManifexComponent implements OnInit {

  @Input() manifexPncAgreementDate: Date;
  @Input() manifexDeletionDate: Date;
  @Input() manifex: ManifexLightModel;

  matricule: string;
  loadingPdf = false;

  constructor(
    private manifexService: ManifexService,
    private fileService: FileService,
    private sessionService: SessionService,
    private connectivityService: ConnectivityService,
    private pncService: PncService,
    private activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
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
   * Verifie si le pnc n'a jamais eu de fiche manifex
   * @return true si pnc n'a jamais eu fiche, false sinon.
   */
  public pncNeverHadManifex(): boolean {
    return !(this.manifex || this.manifexPncAgreementDate);
  }

  /**
   * Récupère la date d'agrément du pnc de la fiche manifex
   *
   * @return la date d'agrément du pnc.
   */
  getManifexPncAgreementDate(): Date {
    return (this.manifex ? this.manifex.pncAgreementDate : this.manifexPncAgreementDate);
  }
}
