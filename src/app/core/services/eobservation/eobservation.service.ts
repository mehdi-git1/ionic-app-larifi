import { SessionService } from './../session/session.service';
import { PncModel } from './../../models/pnc.model';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { OnlineEObservationService } from './online-eobservation.service';
import { OfflineEObservationService } from './offline-eobservation.service';
import { EObservationModel } from '../../models/eobservation/eobservation.model';
import { EObservationTypeEnum } from '../../enums/e-observations-type.enum';
import { TranslateService } from '@ngx-translate/core';
import { EObservationStateEnum } from '../../enums/e-observation-state.enum';



@Injectable()
export class EObservationService extends BaseService {

    constructor(
        protected connectivityService: ConnectivityService,
        private onlineEObservationService: OnlineEObservationService,
        private offlineEObservationService: OfflineEObservationService,
        private translateService: TranslateService,
        private sessionService: SessionService
    ) {
        super(
            connectivityService,
            onlineEObservationService,
            offlineEObservationService
        );

    }

    /**
     * Récupère les EObservations d'un PNC (sur 3 ans ou trois derniéres)
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

    /*
     * Récupère toutes les EObservations d'un PNC
     * @param matricule le matricule du PNC
     * @return une promesse contenant les EObservations trouvées
     */
    getAllEObservations(matricule: string): Promise<EObservationModel[]> {
        return this.onlineEObservationService.getAllEObservations(matricule);
    }

    /**
     * Valide le commentaire pnc de l'eobservation
     * @param eObservation l'eObservation conçernée
     * @return une promesse contenant l'eObservation mise a jour par le commentaire du pnc
     */
    validatePncComment(eObservation: EObservationModel): Promise<EObservationModel> {
        return this.validateEObservation(eObservation);
    }

    /**
     * Valide l'eobservation
     * @param eObservation l'eObservation conçernée
     * @return une promesse contenant l'eObservation mise a jour
     */
    validateEObservation(eObservation: EObservationModel): Promise<EObservationModel> {
        eObservation.lastUpdateAuthor = new PncModel();
        eObservation.lastUpdateAuthor.matricule = this.sessionService.getActiveUser().matricule;
        eObservation.lastUpdateDate = new Date();
        return this.execFunctionService('validateEObservation', eObservation);
    }
}
