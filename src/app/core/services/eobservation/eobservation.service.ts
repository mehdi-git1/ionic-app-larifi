import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { OnlineEObservationService } from './online-eobservation.service';
import { OfflineEObservationService } from './offline-eobservation.service';
import { EObservationModel } from '../../models/eobservation/eobservation.model';
import { EObservationTypeEnum } from '../../enums/e-observations-type.enum';
import { TranslateService } from '@ngx-translate/core';



@Injectable()
export class EObservationService extends BaseService {

    constructor(
        protected connectivityService: ConnectivityService,
        private onlineEObservationService: OnlineEObservationService,
        private offlineEObservationService: OfflineEObservationService,
        private translateService: TranslateService
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

    /**
     * Récupère le label de l'option du type de l'eObs
     * @return le label à afficher
     */
    getDetailOptionType(eObservation): string {
    if (eObservation && (eObservation.type === EObservationTypeEnum.E_CC || eObservation.type === EObservationTypeEnum.E_CCP)) {
        if (eObservation.val) {
        return this.translateService.instant('EOBSERVATION.DETAILS.VAL_TITLE_OPTION');
        } else if (eObservation.formationFlight) {
        return this.translateService.instant('EOBSERVATION.DETAILS.FORMATION_FLIGHT_TITLE_OPTION');
        }
    }
    return '';
    }
}
