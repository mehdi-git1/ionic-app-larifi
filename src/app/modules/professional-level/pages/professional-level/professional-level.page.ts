import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import * as _ from 'lodash';

import { ProfessionalLevelModel } from '../../../../core/models/professional-level/professional-level.model';
import { ProfessionalLevelService } from '../../../../core/services/professional-level/professional-level.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { PncModel } from '../../../../core/models/pnc.model';
import { EObservationModel } from '../../../../core/models/eobservation.model';
import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';

@Component({
  selector: 'page-professional-level',
  templateUrl: 'professional-level.page.html',
})
export class ProfessionalLevelPage {

  pnc: PncModel;
  matricule: string;
  professionalLevel: ProfessionalLevelModel;

  eObservations: EObservationModel[];

  listItemLegend = [];

  constructor(private navParams: NavParams,
    private sessionService: SessionService,
    private pncService: PncService,
    private professionalLevelService: ProfessionalLevelService,
    private eObservationService: EObservationService) {
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
        this.getEObservationsList();
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
   * @return clone trié du ProfessionalLevelModel passé en parametre.
   */
  sortProfessionalLevel(professionalLevel: ProfessionalLevelModel): ProfessionalLevelModel {
    const sortedProfessionalLevel: ProfessionalLevelModel = _.cloneDeep(professionalLevel);

    if (sortedProfessionalLevel.stages) {
      // Tri de l'ordre des stages
      sortedProfessionalLevel.stages = sortedProfessionalLevel.stages.sort((a, b) => a.date < b.date ? 1 : -1);

      // Tri de l'ordre des modules
      for (const stage of sortedProfessionalLevel.stages) {
        if (stage.modules) {
          stage.modules = stage.modules.sort((a, b) => a.date < b.date ? 1 : -1);
        }
      }
    }
    return sortedProfessionalLevel;
  }

  /**
 * Récupére la liste des eObservations
 */
  getEObservationsList() {
    this.eObservationService.getEObservations(this.matricule).then(
      eobs => {
        this.eObservations = eobs;
      }, error => {
      });
  }

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return typeof this.professionalLevel !== 'undefined';
  }

}
