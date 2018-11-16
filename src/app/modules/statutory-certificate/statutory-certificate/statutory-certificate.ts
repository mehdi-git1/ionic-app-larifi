import { TranslateService } from '@ngx-translate/core';
import { ToastProvider } from '../../../core/services/toast/toast';
import { StatutoryCertificate } from '../../../core/models/statutoryCertificate';
import { StatutoryCertificateProvider } from '../../../core/services/statutory-certificate/statutory-certificate';
import { PncProvider } from '../../../core/services/pnc/pnc';
import { SessionService } from '../../../../services/session.service';
import { Pnc } from '../../../core/models/pnc';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-statutory-certificate',
  templateUrl: 'statutory-certificate.html',
})

export class StatutoryCertificatePage {

  pnc: Pnc;
  formatedSpeciality: string;
  matricule: string;
  statutoryCertificate: StatutoryCertificate;

  constructor(
    private navParams: NavParams,
    private sessionService: SessionService,
    private pncProvider: PncProvider,
    private statutoryCertificateProvider: StatutoryCertificateProvider
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
