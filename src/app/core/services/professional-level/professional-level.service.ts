import { Injectable } from '@angular/core';

import { ProfessionalLevelModel } from '../../models/professional-level/professional-level.model';
import { ScoreModel } from '../../models/professional-level/score.model';
import { BaseService } from '../base/base.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { OfflineProfessionalLevelService } from './offline-professional-level.service';
import { OnlineProfessionalLevelService } from './online-professional-level.service';

@Injectable({ providedIn: 'root' })
export class ProfessionalLevelService extends BaseService {

  constructor(
    public connectivityService: ConnectivityService,
    private onlineProfessionalLevelProvider: OnlineProfessionalLevelService,
    private offlineProfessionalLevelProvider: OfflineProfessionalLevelService) {
    super(
      connectivityService,
      onlineProfessionalLevelProvider,
      offlineProfessionalLevelProvider
    );
  }

  /**
   * Récupère le suivi réglementaire d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer le suivi réglementaire
   * @return le suivi réglementaire du PNC
   */
  getProfessionalLevel(matricule: string): Promise<ProfessionalLevelModel> {
    return this.execFunctionService('getProfessionalLevel', matricule).then(professionalLevelModel => {
      return this.sortScoreModuleByOrder(professionalLevelModel);
    });
  }

  /**
   * Tri les scores des modules des suivis reglémentaires par l'attribut order
   * @param professionalLevelModel  liste des suivis reglémentaires à trier
   * @return professionalLevelModel liste des suivis reglémentaires triés
   */
  sortScoreModuleByOrder(professionalLevelModel: ProfessionalLevelModel): ProfessionalLevelModel {
    for (const stage of professionalLevelModel.stages) {
      if (stage.modules) {
        // Tri de l'ordre des scores
        for (const module of stage.modules) {
          if (module.scores) {
            module.scores = this.sortScoresByOrder(module.scores);
          }
        }
      }
    }
    return professionalLevelModel;
  }

  /**
   * Trie la liste des scores par ordre
   * @param scores liste de scores
   * @return liste de scores triés
   */
  sortScoresByOrder(scores: ScoreModel[]): ScoreModel[] {
    return scores.sort((a, b) => a.order > b.order ? 1 : -1);
  }

}
