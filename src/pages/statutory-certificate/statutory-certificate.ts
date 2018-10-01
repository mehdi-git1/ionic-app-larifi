import { TranslateService } from '@ngx-translate/core';
import { ToastProvider } from './../../providers/toast/toast';
import { StatutoryCertificate } from './../../models/statutoryCertificate';
import { StatutoryCertificateProvider } from './../../providers/statutory-certificate/statutory-certificate';
import { PncProvider } from './../../providers/pnc/pnc';
import { SessionService } from './../../services/session.service';
import { Pnc } from './../../models/pnc';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';


@Component({
  selector: 'page-statutory-certificate',
  templateUrl: 'statutory-certificate.html',
})

export class StatutoryCertificatePage {

  pnc: Pnc;
  matricule: string;
  statutoryCertificate: StatutoryCertificate;

  planeQualif: Array<string> = ['Géné', 'A320', 'B777', 'B787'];

  constructor(
    private navParams: NavParams,
    private sessionService: SessionService,
    private pncProvider: PncProvider,
    private statutoryCertificateProvider: StatutoryCertificateProvider,
    private toastProvider: ToastProvider,
    private translate: TranslateService) { }

  ionViewDidEnter() {
    if (this.navParams.get('matricule')) {
      this.matricule = this.navParams.get('matricule');
    } else if (this.sessionService.getActiveUser()) {
      this.matricule = this.sessionService.getActiveUser().matricule;
    }
    if (this.matricule != null) {
      this.pncProvider.getPnc(this.matricule).then(pnc => {
        this.pnc = pnc;
      }, error => { });
      this.statutoryCertificateProvider.getStatutoryCertificate(this.matricule).then(statutoryCertificate => {
        this.statutoryCertificate = statutoryCertificate;
      }).catch(error => {
        const errorMsg = this.translate.instant('STATUTORY_CERTIFICATE.ERROR.STATUTORY_CERTIFICATE', { 'matricule': this.matricule });
        this.toastProvider.error(errorMsg);
      });
    }
  }

}
