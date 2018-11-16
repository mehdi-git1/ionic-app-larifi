import { DateTransformService } from '../../../../services/date.transform.service';
import { CareerObjectiveTransformerProvider } from './career-objective-transformer';
import { SessionService } from '../../../../services/session.service';
import { OnlineCareerObjectiveProvider } from './online-career-objective';
import { ConnectivityService } from '../../../../services/connectivity/connectivity.service';
import { OfflineCareerObjectiveProvider } from './offline-career-objective';
import { CareerObjective } from '../../models/careerObjective';
import { Injectable } from '@angular/core';
import { RestService } from '../../../../services/rest/rest.base.service';
import { Pnc } from '../../models/pnc';
import { OfflineAction } from '../../models/offlineAction';
import { BaseProvider } from '../base/base.provider';

@Injectable()
export class CareerObjectiveProvider extends BaseProvider {
  constructor(
    private onlineCareerObjectiveProvider: OnlineCareerObjectiveProvider,
    private offlineCareerObjectiveProvider: OfflineCareerObjectiveProvider,
    protected connectivityService: ConnectivityService,
    private sessionService: SessionService,
    private dateTransformer: DateTransformService,
    private careerObjectiveTransformer: CareerObjectiveTransformerProvider) {
    super(
      connectivityService,
      onlineCareerObjectiveProvider,
      offlineCareerObjectiveProvider
    );
  }

  /**
   * Retourne les objectifs d'un pnc donné
   * @param matricule le matricule du pnc dont on souhaite récupérer les objectifs
   * @return la liste des objectifs du pnc
   */
  getPncCareerObjectives(matricule: string): Promise<CareerObjective[]> {
    return this.execFunctionProvider('getPncCareerObjectives', matricule);
  }


  /**
   * Créé ou met à jour un objectif
   * @param  careerObjective l'objectif à créer ou mettre à jour
   * @return une promesse contenant l'objectif créé ou mis à jour
   */
  createOrUpdate(careerObjective: CareerObjective): Promise<CareerObjective> {

    if (careerObjective.techId === undefined) {
      careerObjective.creationDate = this.dateTransformer.transformDateToIso8601Format(new Date());
      careerObjective.creationAuthor = new Pnc();
      careerObjective.creationAuthor.matricule = this.sessionService.getActiveUser().matricule;
    }
    careerObjective.lastUpdateAuthor = new Pnc();
    careerObjective.lastUpdateAuthor.matricule = this.sessionService.getActiveUser().matricule;
    careerObjective.lastUpdateDate = this.dateTransformer.transformDateToIso8601Format(new Date());

    return this.execFunctionProvider('createOrUpdate', careerObjective);
  }

  /**
  * Récupère un objectif
  * @param id l'id de l'objectif à récupérer
  * @return l'objectif récupéré
  */
  getCareerObjective(id: number): Promise<CareerObjective> {
    return this.execFunctionProvider('getCareerObjective', id);
  }

  /**
  * Supprime un objectif
  * @param id l'id de l'objectif à supprimer
  * @return l'objectif supprimé
  */
  delete(id: number): Promise<CareerObjective> {
    return this.execFunctionProvider('delete', id);
  }

  /**
   * Envoi au serveur une demande de sollicitation instructeur pour l'objectif
   * @param id l'id de l'objectif pour lequel on souhaiter solliciter l'instructeur
   */
  createInstructorRequest(id: number): Promise<void> {
    return this.onlineCareerObjectiveProvider.createInstructorRequest(id);
  }

}
