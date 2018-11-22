import { ProfessionalLevelModel } from '../../../../core/models/professional-level/professional-level.model';
import { ProfessionalLevelService } from '../../../../core/services/professional-level/professional-level.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { PncModel } from '../../../../core/models/pnc.model';
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'page-professional-level',
  templateUrl: 'professional-level.page.html',
})
export class ProfessionalLevelPage {

  pnc: PncModel;
  matricule: string;
  professionalLevel: ProfessionalLevelModel;
  constructor(private navParams: NavParams,
    private sessionService: SessionService,
    private pncProvider: PncService,
    private professionalLevelProvider: ProfessionalLevelService) {
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
