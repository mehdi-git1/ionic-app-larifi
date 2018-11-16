import { ProfessionalLevel } from '../../../core/models/professionalLevel/professional-level';
import { ProfessionalLevelProvider } from '../../../core/services/professional-level/professional-level';
import { PncProvider } from '../../../core/services/pnc/pnc';
import { SessionService } from '../../../../services/session.service';
import { Pnc } from '../../../core/models/pnc';
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

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
    } else if (this.sessionService.getActiveUser()) {
      this.matricule = this.sessionService.getActiveUser().matricule;
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
