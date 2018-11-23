import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { StatutoryCertificateModel } from '../../../../core/models/statutory.certificate.model';
import { StatutoryCertificateService } from '../../../../core/services/statutory-certificate/statutory-certificate.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { PncModel } from '../../../../core/models/pnc.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-statutory-certificate',
  templateUrl: 'statutory-certificate.page.html',
})

export class StatutoryCertificatePage {

  pnc: PncModel;
  formatedSpeciality: string;
  matricule: string;
  statutoryCertificate: StatutoryCertificateModel;

  constructor(
    private navParams: NavParams,
    private sessionService: SessionService,
    private pncProvider: PncService,
    private statutoryCertificateProvider: StatutoryCertificateService
  ) { }

  ionViewDidEnter() {
    if (this.navParams.get('matricule')) {
      this.matricule = this.navParams.get('matricule');
    } else if (this.sessionService.getActiveUser()) {
      this.matricule = this.sessionService.getActiveUser().matricule;
    }
    if (this.matricule != null) {
      this.pncProvider.getPnc(this.matricule).then(pnc => {
        this.pnc = pnc;
        this.formatedSpeciality = this.pncProvider.getFormatedSpeciality(pnc);
      }, error => { });
      this.statutoryCertificateProvider.getStatutoryCertificate(this.matricule).then(statutoryCertificate => {
        this.statutoryCertificate = statutoryCertificate;
      }, error => { });
    }
  }

  /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
  loadingIsOver(): boolean {
    return typeof this.statutoryCertificate !== 'undefined';
  }
}
