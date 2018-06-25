import { Observable } from 'rxjs/Rx';
import { Pnc } from './../../models/pnc';
import { CareerObjectiveProvider } from './../career-objective/career-objective';
import { WaypointProvider } from './../waypoint/waypoint';
import { PncProvider } from './../pnc/pnc';
import { Injectable } from '@angular/core';

@Injectable()
export class OfflineProvider {

  constructor(private pncProvider: PncProvider,
    private careerObjectiveProvider: CareerObjectiveProvider,
    private waypointProvider: WaypointProvider) {
  }

  /**
   * Charge toutes les ressources nécessaires à la consultation hors ligne d'un eDossier
   * @param pnc le pnc dont on souhaite récupérer le eDossier
   * @return une promesse qui est résolue quand toute la synchro est terminée
   */
  downloadPncEdossier(pnc: Pnc): Promise<boolean> {
    let promiseCount = 0;
    let resolvedPromiseCount = 0;

    return new Promise((resolve, reject) => {
      Observable.create(
        observer => {

          promiseCount++;
          this.pncProvider.getPnc(pnc.matricule, true).then(success => {
            resolvedPromiseCount++;
            observer.next(false);
          }, error => {
            resolvedPromiseCount++;
            observer.next(false);
          });

          promiseCount++;
          this.careerObjectiveProvider.getPncCareerObjectives(pnc.matricule, false).then(careerObjectiveList => {
            resolvedPromiseCount++;
            observer.next(careerObjectiveList.length > 0);
            for (const careerObjective of careerObjectiveList) {
              promiseCount++;
              this.careerObjectiveProvider.getCareerObjective(careerObjective.techId, true).then(success => {
                resolvedPromiseCount++;
                observer.next(false);
              }, error => {
                resolvedPromiseCount++;
                observer.next(false);
              });

              promiseCount++;
              this.waypointProvider.getCareerObjectiveWaypoints(careerObjective.techId, true).then(waypointList => {
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

}
