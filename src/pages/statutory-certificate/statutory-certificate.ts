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
	private statutoryCertificateProvider: StatutoryCertificateProvider
  ) {}

  ionViewDidEnter() {
    if (this.navParams.get('matricule')) {
      this.matricule = this.navParams.get('matricule');
    } else if (this.sessionService.authenticatedUser) {
        this.matricule = this.sessionService.authenticatedUser.matricule;
    }
    if (this.matricule != null) {
        this.pncProvider.getPnc(this.matricule).then(pnc => {
            this.pnc = pnc;
        }, error => {});
		this.statutoryCertificateProvider.getStatutoryCertificate(this.matricule).then(statutoryCertificate => {
          this.statutoryCertificate = statutoryCertificate;
        }).catch();
    }
  }

}
