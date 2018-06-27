import { OnlinePncProvider } from './../pnc/online-pnc';
import { OnlineWaypointProvider } from './../waypoint/online-waypoint';
import { OnlineCareerObjectiveProvider } from './../career-objective/online-career-objective';
import { Observable } from 'rxjs/Rx';
import { Pnc } from './../../models/pnc';
import { Injectable } from '@angular/core';
import { EDossierPncObject } from '../../models/eDossierPncObject';

@Injectable()
export class OfflineProvider {

  constructor(private onlinePncProvider: OnlinePncProvider,
    private onlineCareerObjectiveProvider: OnlineCareerObjectiveProvider,
    private onlineWaypointProvider: OnlineWaypointProvider) {
  }

  /**
   * Charge toutes les ressources nécessaires à la consultation hors ligne d'un eDossier
   * @param matricule le matricule du PNC dont on souhaite récupérer le eDossier
   * @return une promesse qui est résolue quand toute la synchro est terminée
   */
  downloadPncEdossier(matricule: string): Promise<boolean> {
    let promiseCount = 0;
    let resolvedPromiseCount = 0;

    return new Promise((resolve, reject) => {
      Observable.create(
        observer => {

          promiseCount++;
          this.onlinePncProvider.getPnc(matricule, true).then(success => {
            resolvedPromiseCount++;
            observer.next(false);
          }, error => {
            resolvedPromiseCount++;
            observer.next(false);
          });

          promiseCount++;
          this.onlineCareerObjectiveProvider.getPncCareerObjectives(matricule, false).then(careerObjectiveList => {
            resolvedPromiseCount++;
            observer.next(careerObjectiveList.length > 0);
            for (const careerObjective of careerObjectiveList) {
              promiseCount++;
              this.onlineCareerObjectiveProvider.getCareerObjective(careerObjective.techId, true).then(success => {
                resolvedPromiseCount++;
                observer.next(false);
              }, error => {
                resolvedPromiseCount++;
                observer.next(false);
              });

              promiseCount++;
              this.onlineWaypointProvider.getCareerObjectiveWaypoints(careerObjective.techId, true).then(waypointList => {
                resolvedPromiseCount++;
                observer.next(false);
              }, error => {
                resolvedPromiseCount++;
                observer.next(false);
              });
            }
          }, error => {
            resolvedPromiseCount++;
            observer.next(false);
          });
        }).subscribe(
          promiseToCome => {
            if (!promiseToCome && this.isSynchroOver(promiseCount, resolvedPromiseCount)) {
              resolve(true);
            }
          });
    });
  }

  /**
   * Vérifie que la syncho est terminée (que toutes les promesses ont été résolues)
   * @param promiseCount Le nombre de promesse à résoudre
   * @param resolvedPromiseCount Le nombre de promesses résolues
   * @return vrai si la synchro est terminée, false sinon
   */
  isSynchroOver(promiseCount, resolvedPromiseCount): boolean {
    return resolvedPromiseCount >= promiseCount;
  }

  /**
   * Marque les données comme dispo hors ligne si ces dernières sont en cache
   * @param onlineData les données issues du backend
   * @param offlineData les données issues du stockage local
   */
  flagDataAvailableOffline(onlineData: any, offlineData: any) {
    if (Array.isArray(offlineData)) {
      this.flagEDossierPncObjectArrayAsAvailableOffline(onlineData, offlineData);
    } else if (offlineData !== null) {
      this.flagEDossierPncObjectAsAvailableOffline(onlineData, offlineData);
    }
  }

  /**
   * Marque l'objet EdossierPnc comme dispo offline
   * @param onlineData un objet issu du backend
   * @param offlineData un objet issu du stockage local
   */
  private flagEDossierPncObjectAsAvailableOffline(onlineData: EDossierPncObject, offlineData: EDossierPncObject) {
    if (offlineData && offlineData.getTechId() === onlineData.getTechId()) {
      onlineData.availableOffline = true;
    }
  }

  /**
   * Marque les données comme dispo en hors connexion si celle ci sont retrouvées dans le stockage local de l'appli
   * @param onlineDataArray le tableau contenant les données retournées par le serveur
   * @param offlineDataArray le tableau contenant les données retrouvées en local
   */
  private flagEDossierPncObjectArrayAsAvailableOffline(onlineDataArray: EDossierPncObject[], offlineDataArray: EDossierPncObject[]) {
    for (const onlineData of onlineDataArray) {
      for (const offlineData of offlineDataArray) {
        this.flagEDossierPncObjectAsAvailableOffline(onlineData, offlineData);
      }
    }
  }

}
