import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { OnlineEObservationService } from './online-eobservation.service';
import { OfflineEObservationService } from './offline-eobservation.service';
import { EObservationModel } from '../../models/eobservation.model';



@Injectable()
export class EObservationService extends BaseService {

    constructor(
        protected connectivityService: ConnectivityService,
        private onlineEObservationService: OnlineEObservationService,
        private offlineEObservationService: OfflineEObservationService
    ) {
        super(
            connectivityService,
            onlineEObservationService,
            offlineEObservationService
        );

    }

    /**
     * Récupère les EObservations d'un PNC
     * @param matricule le matricule du PNC
     * @return une promesse contenant les EObservations trouvées
     */
    getEObservations(matricule: string): Promise<EObservationModel[]> {
        return this.execFunctionService('getEObservations', matricule);
    }
}
