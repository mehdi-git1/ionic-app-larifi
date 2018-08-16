import { LegTransformerProvider } from './leg-transformer';
import { OfflineProvider } from './../offline/offline';
import { OfflineRotationProvider } from './../rotation/offline-rotation';
import { OnlineLegProvider } from './online-leg';
import { OfflineLegProvider } from './offline-leg';
import { Leg } from './../../models/leg';
import { CrewMember } from './../../models/crewMember';
import { Injectable } from '@angular/core';
import { ConnectivityService } from './../../services/connectivity.service';
import { Rotation } from '../../models/rotation';

@Injectable()
export class LegProvider {

  private legUrl: string;

  constructor(private connectivityService: ConnectivityService,
    private onlineLegProvider: OnlineLegProvider,
    private legTransformer: LegTransformerProvider,
    private offlineLegProvider: OfflineLegProvider, private offlineRotationProvider: OfflineRotationProvider, private offlineProvider: OfflineProvider) {
  }

  /**
  * Récupère les informations d'un tronçon
  * @param legId l'id du tronçon dont on souhaite avoir les informations
  * @return les informations du leg
  */
  getLeg(legId: number): Promise<Leg> {
    return this.connectivityService.isConnected() ?
      this.onlineLegProvider.getLeg(legId) :
      this.offlineLegProvider.getLeg(legId);
  }

  /**
  * Récupère la liste équipage d'un tronçon
  * @param legId l'id du tronçon dont on souhaite avoir la liste équipage
  * @return la liste équipage d'un tronçon
  */
  getFlightCrewFromLeg(legId: number): Promise<CrewMember[]> {
    return this.connectivityService.isConnected() ?
      this.onlineLegProvider.getFlightCrewFromLeg(legId) :
      this.offlineLegProvider.getFlightCrewFromLeg(legId);
  }

  /**
   *  Met à jour la date de mise en cache dans l'objet online
   * @param leg objet online
   */
  refresh(leg: Leg) {
    this.offlineLegProvider.getLeg(leg.techId).then(offlineLeg => {
      const offlineData = this.legTransformer.toLeg(offlineLeg);
      this.offlineProvider.flagDataAvailableOffline(leg, offlineData);
    });
  }
}
