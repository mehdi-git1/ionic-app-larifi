import { Injectable } from '@angular/core';

import { DateTransform } from '../../../shared/utils/date-transform';
import { SessionService } from '../session/session.service';
import { OnlineCareerObjectiveService } from './online-career-objective';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { OfflineCareerObjectiveService } from './offline-career-objective.service';
import { CareerObjectiveModel } from '../../models/career-objective.model';
import { PncModel } from '../../models/pnc.model';
import { BaseService } from '../base/base.service';

@Injectable()
export class CareerObjectiveProvider extends BaseService {
  constructor(
    private onlineCareerObjectiveService: OnlineCareerObjectiveService,
    private offlineCareerObjectiveService: OfflineCareerObjectiveService,
    protected connectivityService: ConnectivityService,
    private sessionService: SessionService,
    private dateTransformer: DateTransform) {
    super(
      connectivityService,
      onlineCareerObjectiveService,
      offlineCareerObjectiveService
    );
  }

  /**
   * Retourne les objectifs d'un pnc donné
   * @param matricule le matricule du pnc dont on souhaite récupérer les objectifs
   * @return la liste des objectifs du pnc
   */
  getPncCareerObjectives(matricule: string): Promise<CareerObjectiveModel[]> {
    return this.execFunctionProvider('getPncCareerObjectives', matricule);
  }


  /**
   * Créé ou met à jour un objectif
   * @param  careerObjective l'objectif à créer ou mettre à jour
   * @return une promesse contenant l'objectif créé ou mis à jour
   */
  createOrUpdate(careerObjective: CareerObjectiveModel): Promise<CareerObjectiveModel> {

    if (careerObjective.techId === undefined) {
      careerObjective.creationDate = this.dateTransformer.transformDateToIso8601Format(new Date());
      careerObjective.creationAuthor = new PncModel();
      careerObjective.creationAuthor.matricule = this.sessionService.getActiveUser().matricule;
    }
    careerObjective.lastUpdateAuthor = new PncModel();
    careerObjective.lastUpdateAuthor.matricule = this.sessionService.getActiveUser().matricule;
    careerObjective.lastUpdateDate = this.dateTransformer.transformDateToIso8601Format(new Date());

    return this.execFunctionProvider('createOrUpdate', careerObjective);
  }

  /**
  * Récupère un objectif
  * @param id l'id de l'objectif à récupérer
  * @return l'objectif récupéré
  */
  getCareerObjective(id: number): Promise<CareerObjectiveModel> {
    return this.execFunctionProvider('getCareerObjective', id);
  }

  /**
  * Supprime un objectif
  * @param id l'id de l'objectif à supprimer
  * @return l'objectif supprimé
  */
  delete(id: number): Promise<CareerObjectiveModel> {
    return this.execFunctionProvider('delete', id);
  }

  /**
   * Envoi au serveur une demande de sollicitation instructeur pour l'objectif
   * @param id l'id de l'objectif pour lequel on souhaiter solliciter l'instructeur
   */
  createInstructorRequest(id: number): Promise<void> {
    return this.onlineCareerObjectiveService.createInstructorRequest(id);
  }

}