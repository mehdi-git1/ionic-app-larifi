import { ProfessionalLevelModel } from '../../../../core/models/professional-level/professional-level.model';
import { ProfessionalLevelService } from '../../../../core/services/professional-level/professional-level.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { PncModel } from '../../../../core/models/pnc.model';
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import * as _ from 'lodash';

@Component({
  selector: 'page-professional-level',
  templateUrl: 'professional-level.page.html',
})
export class ProfessionalLevelPage {

  pnc: PncModel;
  matricule: string;
  professionalLevel: ProfessionalLevelModel;

  listItemLegend = [];

  constructor(private navParams: NavParams,
    private sessionService: SessionService,
    private pncService: PncService,
    private professionalLevelService: ProfessionalLevelService) {
  }

  ionViewDidLoad() {

    this.listItemLegend.push('PROFESSIONAL_LEVEL.LEGEND.A',
      'PROFESSIONAL_LEVEL.LEGEND.T',
      'PROFESSIONAL_LEVEL.LEGEND.R',
      'PROFESSIONAL_LEVEL.LEGEND.E1',
      'PROFESSIONAL_LEVEL.LEGEND.E2',
      'PROFESSIONAL_LEVEL.LEGEND.FC');

    if (this.navParams.get('matricule')) {
      this.matricule = this.navParams.get('matricule');
    } else if (this.sessionService.getActiveUser()) {
      this.matricule = this.sessionService.getActiveUser().matricule;
    }
    if (this.matricule != null) {
      this.pncService.getPnc(this.matricule).then(pnc => {
        this.pnc = pnc;
      }, error => { });

      this.professionalLevelService.getProfessionalLevel(this.matricule).then(professionalLevelResult => {
        this.professionalLevel = this.sortProfessionalLevel(professionalLevelResult);
      }, error => { });
    }
  }

  /**
   * Renvoi un clone trié du ProfessionalLevelModel passé en parametre
   *
   * @param professionalLevel
   */
  sortProfessionalLevel(professionalLevel: ProfessionalLevelModel): ProfessionalLevelModel {
    const professionalLevelLocal: ProfessionalLevelModel = _.cloneDeep(professionalLevel);

    if (professionalLevelLocal.stages) {
      // Tri de l'ordre des stages
      professionalLevelLocal.stages = professionalLevelLocal.stages.sort(function (a, b) {
        return (a.date < b.date) ? 1 : -1;
      });

      // Tri de l'ordre des modules
      for (const stage in professionalLevelLocal.stages) {
        if (professionalLevelLocal.stages[stage].modules) {
          professionalLevelLocal.stages[stage].modules = professionalLevelLocal.stages[stage].modules.sort(function (a, b) {
            return (a.date < b.date) ? 1 : -1;
          });
        }
      }
    }
    return professionalLevelLocal;
  }

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return typeof this.professionalLevel !== 'undefined';
  }

}
