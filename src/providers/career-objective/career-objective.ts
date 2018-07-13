import { SessionService } from './../../services/session.service';
import { DatePipe } from '@angular/common';
import { CareerObjectiveTransformerProvider } from './career-objective-transformer';
import { OfflineProvider } from './../offline/offline';
import { OnlineCareerObjectiveProvider } from './online-career-objective';
import { ConnectivityService } from './../../services/connectivity.service';
import { OfflineCareerObjectiveProvider } from './../career-objective/offline-career-objective';
import { Config } from './../../configuration/environment-variables/config';
import { CareerObjective } from './../../models/careerObjective';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';
import { Pnc } from '../../models/pnc';

@Injectable()
export class CareerObjectiveProvider {
  constructor(
    private onlineCareerObjectiveProvider: OnlineCareerObjectiveProvider,
    private offlineCareerObjectiveProvider: OfflineCareerObjectiveProvider,
    private offlineProvider: OfflineProvider,
    private careerObjectiveTransformer: CareerObjectiveTransformerProvider,
    private connectivityService: ConnectivityService,
    private sessionService: SessionService,
    private datePipe: DatePipe) {
  }

  /**
   * Retourne les objectifs d'un pnc donné
   * @param matricule le matricule du pnc dont on souhaite récupérer les objectifs
   * @return la liste des objectifs du pnc
   */
  getPncCareerObjectives(matricule: string): Promise<CareerObjective[]> {
    if (this.connectivityService.isConnected()) {
      return new Promise((resolve, reject) => {
        this.offlineCareerObjectiveProvider.getPncCareerObjectives(matricule).then(offlineCareerObjectives => {
          this.onlineCareerObjectiveProvider.getPncCareerObjectives(matricule).then(onlineCareerObjectives => {
            const onlineData = this.careerObjectiveTransformer.toCareerObjectives(onlineCareerObjectives);
            const offlineData = this.careerObjectiveTransformer.toCareerObjectives(offlineCareerObjectives);
            this.offlineProvider.flagDataAvailableOffline(onlineData, offlineData);
            resolve(onlineData);
          });
        });
      });
    } else {
      return this.offlineCareerObjectiveProvider.getPncCareerObjectives(matricule);
    }
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
}
