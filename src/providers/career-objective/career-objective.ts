import { CareerObjectiveTransformerProvider } from './career-objective-transformer';
import { SessionService } from './../../services/session.service';
import { DatePipe } from '@angular/common';
import { OnlineCareerObjectiveProvider } from './online-career-objective';
import { ConnectivityService } from './../../services/connectivity.service';
import { OfflineCareerObjectiveProvider } from './../career-objective/offline-career-objective';
import { CareerObjective } from './../../models/careerObjective';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';
import { Pnc } from '../../models/pnc';
import { OfflineAction } from '../../models/offlineAction';

@Injectable()
export class CareerObjectiveProvider {
  constructor(
    private onlineCareerObjectiveProvider: OnlineCareerObjectiveProvider,
    private offlineCareerObjectiveProvider: OfflineCareerObjectiveProvider,
    private connectivityService: ConnectivityService,
    private sessionService: SessionService,
    private datePipe: DatePipe,
    private careerObjectiveTransformer: CareerObjectiveTransformerProvider) {
  }

  /**
   * Retourne les objectifs d'un pnc donné
   * @param matricule le matricule du pnc dont on souhaite récupérer les objectifs
   * @return la liste des objectifs du pnc
   */
  getPncCareerObjectives(matricule: string): Promise<CareerObjective[]> {
    return this.connectivityService.isConnected() ?
      new Promise((resolve, reject) => {
        this.offlineCareerObjectiveProvider.getPncCareerObjectives(matricule).then(offlineCareerObjectives => {
          this.onlineCareerObjectiveProvider.getPncCareerObjectives(matricule).then(onlineCareerObjectives => {
            const onlineData = this.careerObjectiveTransformer.toCareerObjectives(onlineCareerObjectives);
            const offlineData = this.careerObjectiveTransformer.toCareerObjectives(offlineCareerObjectives);
            // his.offlineProvider.flagDataAvailableOffline(onlineData, offlineData);
            resolve(this.getOnlineAndOfflineCareerObjectives(onlineData, offlineData));
          });
        });
      })
      :
      this.offlineCareerObjectiveProvider.getPncCareerObjectives(matricule);

  }

  getOnlineAndOfflineCareerObjectives(onlineDataArray: CareerObjective[], offlineDataArray: CareerObjective[]): CareerObjective[] {
    for (const offlineData of offlineDataArray) {
      const result = onlineDataArray.filter(onlineData => offlineData.getStorageId() === onlineData.getStorageId());
      if (result && result.length === 1) {
        if (offlineData.offlineAction === OfflineAction.UPDATE) {
          onlineDataArray[onlineDataArray.indexOf(result[0])] = offlineData;
        }
      } else {
        onlineDataArray.push(offlineData);
      }
    }
    return onlineDataArray;
  }

  /**
   * Créé ou met à jour un objectif
   * @param  careerObjective l'objectif à créer ou mettre à jour
   * @return une promesse contenant l'objectif créé ou mis à jour
   */
  createOrUpdate(careerObjective: CareerObjective): Promise<CareerObjective> {

    if (careerObjective.techId === undefined) {
      careerObjective.creationDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');
      careerObjective.creationAuthor = new Pnc();
      careerObjective.creationAuthor.matricule = this.sessionService.authenticatedUser.matricule;
    }
    careerObjective.lastUpdateAuthor = new Pnc();
    careerObjective.lastUpdateAuthor.matricule = this.sessionService.authenticatedUser.matricule;
    careerObjective.lastUpdateDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');

    return this.connectivityService.isConnected() ?
      this.onlineCareerObjectiveProvider.createOrUpdate(careerObjective) :
      this.offlineCareerObjectiveProvider.createOrUpdate(careerObjective);
  }

  /**
  * Récupère un objectif
  * @param id l'id de l'objectif à récupérer
  * @return l'objectif récupéré
  */
  getCareerObjective(id: number): Promise<CareerObjective> {
    return this.connectivityService.isConnected() ?
      this.onlineCareerObjectiveProvider.getCareerObjective(id) :
      this.offlineCareerObjectiveProvider.getCareerObjective(id);
  }

  /**
  * Supprime un objectif
  * @param id l'id de l'objectif à supprimer
  * @return l'objectif supprimé
  */
  delete(id: number): Promise<CareerObjective> {
    return this.connectivityService.isConnected() ?
      this.onlineCareerObjectiveProvider.delete(id) :
      this.offlineCareerObjectiveProvider.delete(id);
  }

  /**
   * Envoi au serveur une demande de sollicitation instructeur pour l'objectif
   * @param id l'id de l'objectif pour lequel on souhaiter solliciter l'instructeur
   */
  createInstructorRequest(id: number): Promise<void> {
    return this.onlineCareerObjectiveProvider.createInstructorRequest(id);
  }

}
