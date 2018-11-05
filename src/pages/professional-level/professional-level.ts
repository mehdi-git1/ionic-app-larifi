import { ProfessionalLevel } from './../../models/professionalLevel/professional-level';
import { ProfessionalLevelProvider } from './../../providers/professional-level/professional-level';
import { PncProvider } from './../../providers/pnc/pnc';
import { SessionService } from './../../services/session.service';
import { Pnc } from './../../models/pnc';
import { Stage } from './../../models/professionalLevel/stage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-professional-level',
  templateUrl: 'professional-level.html',
})
export class ProfessionalLevelPage {

  pnc: Pnc;
  matricule: string;
  professionalLevel: ProfessionalLevel;
  constructor(private navParams: NavParams,
    private sessionService: SessionService,
    private pncProvider: PncProvider,
    private professionalLevelProvider: ProfessionalLevelProvider) {
  }

  ionViewDidEnter() {
    if (this.navParams.get('matricule')) {
      this.matricule = this.navParams.get('matricule');
    } else if (this.sessionService.authenticatedUser) {
      this.matricule = this.sessionService.authenticatedUser.matricule;
    }
    if (this.matricule != null) {
      this.pncProvider.getPnc(this.matricule).then(pnc => {
        this.pnc = pnc;
      }, error => { });
      this.professionalLevelProvider.getProfessionalLevel(this.matricule).then(professionalLevel => {
        this.professionalLevel = professionalLevel;
      }, error => { });
    }
  }

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return typeof this.professionalLevel !== 'undefined';
  }

}
