import { DatePipe } from '@angular/common';
import { SessionService } from './../../services/session.service';
import { OfflineProvider } from './../offline/offline';
import { WaypointTransformerProvider } from './waypoint-transformer';
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
    private offlineProvider: OfflineProvider,
    private waypointTransformer: WaypointTransformerProvider,
    private datePipe: DatePipe,
    private sessionService: SessionService) {
  }

  /**
   * Créé ou met à jour un point d'étape
   * @param  waypoint le point d'étape à créer ou mettre à jour
   * @param careerObjectiveId l'id de l'objectif
   * @return une promesse contenant le point d'étape créé ou mis à jour
   */
  createOrUpdate(waypoint: Waypoint, careerObjectiveId: number): Promise<Waypoint> {
    if (waypoint.techId === undefined) {
      waypoint.creationDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');
      waypoint.creationAuthor = new Pnc();
      waypoint.creationAuthor.matricule = this.sessionService.authenticatedUser.matricule;
    }
    waypoint.lastUpdateAuthor = new Pnc();
    waypoint.lastUpdateAuthor.matricule = this.sessionService.authenticatedUser.matricule;
    waypoint.lastUpdateDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');

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
    if (this.connectivityService.isConnected()) {
      return new Promise((resolve, reject) => {
        this.offlineWaypointProvider.getCareerObjectiveWaypoints(careerObjectiveId).then(offlineWaypoints => {
          this.onlineWaypointProvider.getCareerObjectiveWaypoints(careerObjectiveId).then(onlineWaypoints => {
            const onlineData = this.waypointTransformer.toWaypoints(onlineWaypoints);
            const offlineData = this.waypointTransformer.toWaypoints(offlineWaypoints);
            this.offlineProvider.flagDataAvailableOffline(onlineData, offlineData);
            resolve(onlineData);
          });
        });
      });
    } else {
      this.offlineWaypointProvider.getCareerObjectiveWaypoints(careerObjectiveId);
    }
    return this.connectivityService.isConnected() ?
      this.onlineWaypointProvider.getCareerObjectiveWaypoints(careerObjectiveId) :
      this.offlineWaypointProvider.getCareerObjectiveWaypoints(careerObjectiveId);
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
