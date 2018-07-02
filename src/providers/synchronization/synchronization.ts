import { PncTransformerProvider } from './../pnc/pnc-transformer';
import { WaypointTransformerProvider } from './../waypoint/waypoint-transformer';
import { PncSynchro } from './../../models/pncSynchro';
import { Observable } from 'rxjs/Rx';
import { OfflineAction } from './../../models/offlineAction';
import { PncSynchroProvider } from './pnc-synchro';
import { CareerObjectiveTransformerProvider } from './../career-objective/career-objective-transformer';
import { StorageService } from './../../services/storage.service';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { Entity } from '../../models/entity';
import { Pnc } from '../../models/pnc';
import { CareerObjective } from '../../models/careerObjective';

@Injectable()
export class SynchronizationProvider {

  @Output()
  synchroStatusChange = new EventEmitter<boolean>();

  constructor(private storageService: StorageService,
    private careerObjectiveTransformer: CareerObjectiveTransformerProvider,
    private waypointTransformer: WaypointTransformerProvider,
    private pncTransformer: PncTransformerProvider,
    private pncSynchroProvider: PncSynchroProvider) {
  }

  synchronizeOfflineData() {
    const pncSynchroList = this.getPncSynchroList();

    if (pncSynchroList.length > 0) {
      this.synchroStatusChange.emit(true);

      let promiseCount;
      let resolvedPromiseCount = 0;
      Observable.create(
        observer => {
          promiseCount = pncSynchroList.length;
          for (const pncSynchro of pncSynchroList) {
            this.pncSynchroProvider.synchronize(pncSynchro).then(pncSynchroResponse => {
              this.updateLocalStorageFromPncSynchroResponse(pncSynchroResponse);
              resolvedPromiseCount++;
              observer.next(true);
            }, error => {
              resolvedPromiseCount++;
              observer.next(true);
            });
          }
        }).subscribe(promiseResolved => {
          if (resolvedPromiseCount >= promiseCount) {
            this.synchroStatusChange.emit(false);
          }
        });
    }
  }

  storeEDossierOffline(matricule: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.pncSynchroProvider.getPncSynchro(matricule).then(pncSynchro => {
        this.updateLocalStorageFromPncSynchroResponse(pncSynchro);
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  /**
   * Gère la réponse de synchronisation du serveur. Supprime tous les objets associés au PNC pour les recréer ensuite.
   * @param pncSynchroResponse l'objet reçu du serveur
   */
  updateLocalStorageFromPncSynchroResponse(pncSynchroResponse: PncSynchro) {
    this.deleteAllPncOfflineObject(pncSynchroResponse.pnc);

    this.storageService.save(Entity.PNC, this.pncTransformer.toPnc(pncSynchroResponse.pnc));

    // Création des nouveaux objets
    for (const careerObjective of pncSynchroResponse.careerObjectives) {
      this.storageService.save(Entity.CAREER_OBJECTIVE, this.careerObjectiveTransformer.toCareerObjective(careerObjective), true);
      for (const waypoint of careerObjective.waypoints) {
        // On ajoute la clef de l'objectif à chaque point d'étape
        waypoint.careerObjective = new CareerObjective();
        waypoint.careerObjective.techId = careerObjective.techId;
        this.storageService.save(Entity.WAYPOINT, this.waypointTransformer.toWaypoint(waypoint), true);
      }
    }

    this.storageService.persistOfflineMap();
  }

  deleteAllPncOfflineObject(pnc: Pnc) {
    // Suppression des objectifs du PNC
    const careerObjectives = this.storageService.findAll(Entity.CAREER_OBJECTIVE);
    const pncCareerObjectives = careerObjectives.filter(careerObjective => {
      return careerObjective.pnc.matricule === pnc.matricule;
    });
    for (const careerObjective of pncCareerObjectives) {
      // Suppression des points d'étape
      const waypoints = this.storageService.findAll(Entity.WAYPOINT);
      const careerObjectiveWaypoints = waypoints.filter(waypoint => {
        return careerObjective.techId === waypoint.careerObjective.techId;
      });
      for (const waypoint of careerObjectiveWaypoints) {
        this.storageService.delete(Entity.WAYPOINT,
          this.waypointTransformer.toWaypoint(waypoint).getStorageId());
      }
      this.storageService.delete(Entity.CAREER_OBJECTIVE,
        this.careerObjectiveTransformer.toCareerObjective(careerObjective).getStorageId());
    }
  }

  /**
   * Recheche tous les eDossiers nécessitant une synchronisation
   */
  getPncSynchroList() {
    const unsynchronizedCareerObjectives = this.storageService.findAllEDossierPncObjectWithOfflineAction(Entity.CAREER_OBJECTIVE);
    const unsynchronizedWaypoints = this.storageService.findAllEDossierPncObjectWithOfflineAction(Entity.WAYPOINT);

    const pncMap = {};
    for (const careerObjective of unsynchronizedCareerObjectives) {
      careerObjective.waypoints = unsynchronizedWaypoints.filter(waypoint => {
        return waypoint.careerObjective.techId === careerObjective.techId;
      });
      if (!pncMap[careerObjective.pnc.matricule]) {
        pncMap[careerObjective.pnc.matricule] = [];
      }
      pncMap[careerObjective.pnc.matricule].push(careerObjective);
    }

    const pncSynchroList = [];
    // tslint:disable-next-line
    for (const matricule in pncMap) {
      const pncSynchro = new PncSynchro();
      pncSynchro.pnc = new Pnc();
      pncSynchro.pnc.matricule = matricule;
      pncSynchro.careerObjectives = this.careerObjectiveTransformer.toCareerObjectives(pncMap[matricule]);
      pncSynchroList.push(pncSynchro);
    }
    console.log('Objectifs à créer', pncSynchroList);
    return pncSynchroList;
  }

}


