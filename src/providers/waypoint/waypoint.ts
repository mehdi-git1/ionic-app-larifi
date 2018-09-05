import { DateTransformService } from './../../services/date.transform.service';
import { WaypointTransformerProvider } from './waypoint-transformer';
import { SessionService } from './../../services/session.service';
import { OnlineWaypointProvider } from './online-waypoint';
import { OfflineWaypointProvider } from './../waypoint/offline-waypoint';
import { ConnectivityService } from './../../services/connectivity.service';
import { Injectable } from '@angular/core';
import { Waypoint } from './../../models/waypoint';
import { Pnc } from '../../models/pnc';


@Injectable()
export class WaypointProvider {


  constructor(private connectivityService: ConnectivityService,
    private onlineWaypointProvider: OnlineWaypointProvider,
    private offlineWaypointProvider: OfflineWaypointProvider,
    private sessionService: SessionService,
    private dateTransformer: DateTransformService,
    private waypointTransformerProvider: WaypointTransformerProvider) {
  }

  /**
   * Créé ou met à jour un point d'étape
   * @param  waypoint le point d'étape à créer ou mettre à jour
   * @param careerObjectiveId l'id de l'objectif
   * @return une promesse contenant le point d'étape créé ou mis à jour
   */
  createOrUpdate(waypoint: Waypoint, careerObjectiveId: number): Promise<Waypoint> {
    if (waypoint.techId === undefined) {
      waypoint.creationDate = this.dateTransformer.transformDateToIso8601Format(new Date());
      waypoint.creationAuthor = new Pnc();
      waypoint.creationAuthor.matricule = this.sessionService.authenticatedUser.matricule;
    }
    waypoint.lastUpdateAuthor = new Pnc();
    waypoint.lastUpdateAuthor.matricule = this.sessionService.authenticatedUser.matricule;
    waypoint.lastUpdateDate = this.dateTransformer.transformDateToIso8601Format(new Date());

    return this.connectivityService.isConnected() ?
      this.onlineWaypointProvider.createOrUpdate(waypoint, careerObjectiveId) :
      this.offlineWaypointProvider.createOrUpdate(waypoint, careerObjectiveId);
  }

  /**
  * Récupère les points d'étape d'un objectif
  * @param careerObjectiveId l'id de l'objectif des points d'étape à récupérer
  * @return les points d'étape récupérés
  */
  getCareerObjectiveWaypoints(careerObjectiveId: number): Promise<Waypoint[]> {
    return this.connectivityService.isConnected() ?

      new Promise((resolve, reject) => {
        this.offlineWaypointProvider.getCareerObjectiveWaypoints(careerObjectiveId).then(offlineCareerObjectiveWaypoints => {
          this.onlineWaypointProvider.getCareerObjectiveWaypoints(careerObjectiveId).then(onlineCareerObjectiveWaypoints => {
            const onlineData = this.waypointTransformerProvider.toWaypoints(onlineCareerObjectiveWaypoints);
            const offlineData = this.waypointTransformerProvider.toWaypoints(offlineCareerObjectiveWaypoints);
            resolve(this.addUnsynchronizedOfflineCareerObjectivesToOnline(onlineData, offlineData));
          });
        });
      })
      :
      this.offlineWaypointProvider.getCareerObjectiveWaypoints(careerObjectiveId);
  }

  /**
   * Ajoute les points d'étape créés en offline et non synchonisés, à la liste des points d'étape récupérés de la BDD
   * @param onlineDataArray la liste des points d'étape récupérés de la BDD.
   * @param offlineDataArray la liste des points d'étape récupérés du cache
   */
  addUnsynchronizedOfflineCareerObjectivesToOnline(onlineDataArray: Waypoint[], offlineDataArray: Waypoint[]): Waypoint[] {
    for (const offlineData of offlineDataArray) {
      const result = onlineDataArray.filter(onlineData => offlineData.getStorageId() === onlineData.getStorageId());
      if (result && result.length === 1) {
        onlineDataArray[onlineDataArray.indexOf(result[0])] = offlineData;
      } else {
        onlineDataArray.push(offlineData);
      }
    }
    return onlineDataArray;
  }

  /**
  * Récupère un point d'étape
  * @param id l'id du point d'étape à récupérer
  * @return le point d'étape récupéré
  */
  getWaypoint(id: number): Promise<Waypoint> {
    return this.connectivityService.isConnected() ?
      this.onlineWaypointProvider.getWaypoint(id) :
      this.offlineWaypointProvider.getWaypoint(id);
  }

  /**
  * Supprime un point d'étape
  * @param id l'id du point d'étape à supprimer
  * @return le point d'étape supprimé
  */
  delete(id: number): Promise<Waypoint> {
    return this.connectivityService.isConnected() ?
      this.onlineWaypointProvider.delete(id) :
      this.offlineWaypointProvider.delete(id);
  }

}
