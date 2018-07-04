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
import { Waypoint } from '../../models/waypoint';

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

  /**
   * Lance le processus de synchronisation des données modifiées offline
   */
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

  /**
   * Stocke en cache le EDossier du PNC
   * @param matricule le matricule du PNC dont on souhaite mettre en cache le EDossier
   * @return une promesse résolue quand le EDossier est mis en cache
   */
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
      delete careerObjective.offlineAction;
      this.storageService.save(Entity.CAREER_OBJECTIVE, this.careerObjectiveTransformer.toCareerObjective(careerObjective), true);
      for (const waypoint of careerObjective.waypoints) {
        // On ajoute la clef de l'objectif à chaque point d'étape
        delete waypoint.offlineAction;
        waypoint.careerObjective = new CareerObjective();
        waypoint.careerObjective.techId = careerObjective.techId;
        this.storageService.save(Entity.WAYPOINT, this.waypointTransformer.toWaypoint(waypoint), true);
      }
    }

    this.storageService.persistOfflineMap();
  }

  /**
   * Supprime tous les objets du cache, liés à un PNC
   * @param pnc le PNC dont on souhaite supprimer le cache
   */
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

    const pncMap = this.buildPncSynchroMap(unsynchronizedCareerObjectives, unsynchronizedWaypoints);

    const pncSynchroList = [];
    // tslint:disable-next-line
    for (const matricule in pncMap) {
      const pncSynchro = new PncSynchro();
      pncSynchro.pnc = new Pnc();
      pncSynchro.pnc.matricule = matricule;
      pncSynchro.careerObjectives = this.careerObjectiveTransformer.toCareerObjectives(pncMap[matricule]);
      pncSynchroList.push(pncSynchro);
    }
    return pncSynchroList;
  }

  /**
   * Retourne une map contenant les objets PncSynchro à synchroniser.
   * La clef est le matricule du PNC, la valeur est l'objet PncSynchro.
   * @param unsynchronizedCareerObjectives la liste des objectifs à synchroniser
   * @param unsynchronizedWaypoints la liste des points d'étape à synchroniser
   * @return la map contenant les objets PncSynchro, associés au matricule de chaque PNC
   */
  private buildPncSynchroMap(unsynchronizedCareerObjectives: CareerObjective[], unsynchronizedWaypoints: Waypoint[]): any {
    const pncMap = {};
    for (const careerObjective of unsynchronizedCareerObjectives) {
      if (!pncMap[careerObjective.pnc.matricule]) {
        pncMap[careerObjective.pnc.matricule] = new PncSynchro();
        pncMap[careerObjective.pnc.matricule].pnc = careerObjective.pnc;
        pncMap[careerObjective.pnc.matricule].careerObjectives = [];
        pncMap[careerObjective.pnc.matricule].waypoints = [];
      }
      pncMap[careerObjective.pnc.matricule].careerObjectives.push(careerObjective);
    }

    for (const waypoint of unsynchronizedWaypoints) {
      const waypointCareerObjective = this.storageService.findOne(Entity.CAREER_OBJECTIVE, `${waypoint.careerObjective.techId}`);

      if (!pncMap[waypointCareerObjective.pnc.matricule]) {
        pncMap[waypointCareerObjective.pnc.matricule] = new PncSynchro();
        pncMap[waypointCareerObjective.pnc.matricule].pnc = waypointCareerObjective.pnc;
        pncMap[waypointCareerObjective.pnc.matricule].careerObjectives = [];
        pncMap[waypointCareerObjective.pnc.matricule].waypoints = [];
      }
      pncMap[waypointCareerObjective.pnc.matricule].waypoints.push(waypoint);
    }

    return pncMap;
  }

}


