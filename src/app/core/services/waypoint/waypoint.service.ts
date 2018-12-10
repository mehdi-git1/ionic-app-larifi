import { Injectable } from '@angular/core';

import { DateTransform } from '../../../shared/utils/date-transform';
import { SessionService } from '../session/session.service';
import { OnlineWaypointService } from './online-waypoint.service';
import { OfflineWaypointService } from './offline-waypoint.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { WaypointModel } from '../../models/waypoint.model';
import { PncModel } from '../../models/pnc.model';
import { BaseService } from '../base/base.service';


@Injectable()
export class WaypointService extends BaseService {

  constructor(
    protected connectivityService: ConnectivityService,
    private onlineWaypointProvider: OnlineWaypointService,
    private offlineWaypointProvider: OfflineWaypointService,
    private sessionService: SessionService,
    private dateTransformer: DateTransform
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
  createOrUpdate(waypoint: WaypointModel, careerObjectiveId: number): Promise<WaypointModel> {
    if (waypoint.techId === undefined) {
      waypoint.creationDate = this.dateTransformer.transformDateToIso8601Format(new Date());
      waypoint.creationAuthor = new PncModel();
      waypoint.creationAuthor.matricule = this.sessionService.getActiveUser().matricule;
    }
    waypoint.lastUpdateAuthor = new PncModel();
    waypoint.lastUpdateAuthor.matricule = this.sessionService.getActiveUser().matricule;
    waypoint.lastUpdateDate = this.dateTransformer.transformDateToIso8601Format(new Date());

    return this.execFunctionService('createOrUpdate', waypoint, careerObjectiveId);
  }

  /**
  * Récupère les points d'étape d'un objectif
  * @param careerObjectiveId l'id de l'objectif des points d'étape à récupérer
  * @return les points d'étape récupérés
  */
  getCareerObjectiveWaypoints(careerObjectiveId: number): Promise<WaypointModel[]> {
    return this.execFunctionService('getCareerObjectiveWaypoints', careerObjectiveId);
  }

  /**
  * Récupère un point d'étape
  * @param id l'id du point d'étape à récupérer
  * @return le point d'étape récupéré
  */
  getWaypoint(id: number): Promise<WaypointModel> {
    return this.execFunctionService('getWaypoint', id);
  }

  /**
  * Supprime un point d'étape
  * @param id l'id du point d'étape à supprimer
  * @return le point d'étape supprimé
  */
  delete(id: number): Promise<WaypointModel> {
    return this.execFunctionService('delete', id);
  }

}
