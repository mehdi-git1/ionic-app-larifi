import { Injectable } from '@angular/core';

import { DateTransform } from '../../../shared/utils/date-transform';
import { CareerObjectiveFilterModel } from '../../models/career-objective-filter.model';
import { CareerObjectiveModel } from '../../models/career-objective.model';
import { PncModel } from '../../models/pnc.model';
import { BaseService } from '../base/base.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { SessionService } from '../session/session.service';
import { OfflineCareerObjectiveService } from './offline-career-objective.service';
import { OnlineCareerObjectiveService } from './online-career-objective.service';

@Injectable({ providedIn: 'root' })
export class CareerObjectiveService extends BaseService {
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
    return this.execFunctionService('getPncCareerObjectives', matricule);
  }

  /**
   * Récupère les objectifs filtrés d'un pnc donné
   * @param matricule le matricule du PNC dont on souhaite récupérer les objectifs
   * @return la liste des objectifs filtrés
   */
  getCareerObjectivesByFilter(careerObjectiveSearch: CareerObjectiveFilterModel): Promise<CareerObjectiveModel[]> {
    return this.execFunctionService('getCareerObjectivesByFilter', careerObjectiveSearch);
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
      careerObjective.creationAuthor.lastName = this.sessionService.getActiveUser().lastName;
      careerObjective.creationAuthor.firstName = this.sessionService.getActiveUser().firstName;
    }
    careerObjective.lastUpdateAuthor = new PncModel();
    careerObjective.lastUpdateAuthor.matricule = this.sessionService.getActiveUser().matricule;
    careerObjective.lastUpdateAuthor.lastName = this.sessionService.getActiveUser().lastName;
    careerObjective.lastUpdateAuthor.firstName = this.sessionService.getActiveUser().firstName;
    careerObjective.lastUpdateDate = this.dateTransformer.transformDateToIso8601Format(new Date());

    return this.execFunctionService('createOrUpdate', careerObjective);
  }

  /**
   * Récupère un objectif
   * @param id l'id de l'objectif à récupérer
   * @return l'objectif récupéré
   */
  getCareerObjective(id: number): Promise<CareerObjectiveModel> {
    return this.execFunctionService('getCareerObjective', id);
  }

  /**
   * Supprime un objectif
   * @param id l'id de l'objectif à supprimer
   * @return l'objectif supprimé
   */
  delete(id: number): Promise<CareerObjectiveModel> {
    return this.execFunctionService('delete', id);
  }

  /**
   * Récupère les priorités rédigées
   * @param matricule matricule du rédacteur
   * @return la liste des priorités rédigées
   */
  public findCareerObjectivesByRedactor(matricule: string): Promise<CareerObjectiveModel[]> {
    return this.execFunctionService('findCareerObjectivesByRedactor', matricule);
  }

}
