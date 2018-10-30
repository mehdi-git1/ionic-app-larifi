import { DateTransformService } from './../../services/date.transform.service';
import { WaypointTransformerProvider } from './waypoint-transformer';
import { SessionService } from './../../services/session.service';
import { OnlineWaypointProvider } from './online-waypoint';
import { OfflineWaypointProvider } from './../waypoint/offline-waypoint';
import { ConnectivityService } from '../../services/connectivity/connectivity.service';
import { Injectable } from '@angular/core';
import { Waypoint } from './../../models/waypoint';
import { Pnc } from '../../models/pnc';
import { BaseProvider } from '../base/base.provider';


@Injectable()
export class WaypointProvider extends BaseProvider {

  constructor(
    protected connectivityService: ConnectivityService,
    private onlineWaypointProvider: OnlineWaypointProvider,
    private offlineWaypointProvider: OfflineWaypointProvider,
    private sessionService: SessionService,
    private dateTransformer: DateTransformService,
    private waypointTransformerProvider: WaypointTransformerProvider
  ) {
    super(
      connectivityService,
      onlineWaypointProvider,
      offlineWaypointProvider
    );
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

    return this.execFunctionProvider('createOrUpdate', waypoint, careerObjectiveId);
  }

  /**
  * Récupère les points d'étape d'un objectif
  * @param careerObjectiveId l'id de l'objectif des points d'étape à récupérer
  * @return les points d'étape récupérés
  */
  getCareerObjectiveWaypoints(careerObjectiveId: number): Promise<Waypoint[]> {
    return this.execFunctionProvider('getCareerObjectiveWaypoints', careerObjectiveId);
  }

  /**
  * Récupère un point d'étape
  * @param id l'id du point d'étape à récupérer
  * @return le point d'étape récupéré
  */
  getWaypoint(id: number): Promise<Waypoint> {
    return this.execFunctionProvider('getWaypoint', id);
  }

  /**
  * Supprime un point d'étape
  * @param id l'id du point d'étape à supprimer
  * @return le point d'étape supprimé
  */
  delete(id: number): Promise<Waypoint> {
    return this.execFunctionProvider('delete', id);
  }

}
