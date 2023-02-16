import { EObservationSubTypeEnum } from './../../enums/e-observation-subtype.enum';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { EObservationTypeEnum } from '../../enums/e-observations-type.enum';
import {
    ReferentialItemLevelModel
} from '../../models/eobservation/eobservation-referential-item-level.model';
import { EObservationModel } from '../../models/eobservation/eobservation.model';
import { PdfModel } from '../../models/manifex/manifex-pdf.model';
import { PncModel } from '../../models/pnc.model';
import { BaseService } from '../base/base.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { SessionService } from '../session/session.service';
import { OfflineEObservationService } from './offline-eobservation.service';
import { OnlineEObservationService } from './online-eobservation.service';

@Injectable({ providedIn: 'root' })
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
    public getEObservations(matricule: string): Promise<EObservationModel[]> {
        return this.execFunctionService('getEObservations', matricule);
    }

    /**
     * Récupère le label du type de l'eObservation
     * @param eObservation l'eObservation dont on souhaite récupérer le label du type
     * @return le label du type de l'eObservation
     */
    public getEObservationTypeLabel(eObservation: EObservationModel): string {
        if (eObservation) {
            let typeLabel = EObservationTypeEnum.getLabel(eObservation.type);

            let typeSuffix = '';
            if (eObservation && (eObservation.type === EObservationTypeEnum.E_CC || eObservation.type === EObservationTypeEnum.E_CCP) && eObservation.subType && (eObservation.subType !== EObservationSubTypeEnum.CLASSICAL) && (eObservation.subType !== EObservationSubTypeEnum.VAC)) {
                typeSuffix = ' - ' + this.translateService.instant('EOBSERVATION.DETAIL.SUB_TYPE.' + eObservation.subType);
            }
            if (eObservation && eObservation.type === EObservationTypeEnum.E_ALT && eObservation.subType == EObservationSubTypeEnum.VAL) {
                typeSuffix = ' - ' + this.translateService.instant('EOBSERVATION.DETAIL.SUB_TYPE.' + eObservation.subType);
            }

            return `${typeLabel} ${typeSuffix}`;
        }

        return '';
    }

    /*
     * Récupère toutes les EObservations d'un PNC
     * @param matricule le matricule du PNC
     * @return une promesse contenant les EObservations trouvées
     */
    public getAllEObservations(matricule: string): Promise<EObservationModel[]> {
        return this.onlineEObservationService.getAllEObservations(matricule);
    }

    /**
     * Valide le commentaire pnc de l'eobservation
     * @param eObservation l'eObservation conçernée
     * @return une promesse contenant l'eObservation mise a jour par le commentaire du pnc
     */
    public validatePncComment(eObservation: EObservationModel): Promise<EObservationModel> {
        return this.updateEObservation(eObservation);
    }

    /**
     * Met à jour l'eobservation
     * @param eObservation l'eObservation conçernée
     * @return une promesse contenant l'eObservation mise a jour
     */
    public updateEObservation(eObservation: EObservationModel): Promise<EObservationModel> {
        eObservation.lastUpdateAuthor = new PncModel();
        eObservation.lastUpdateAuthor.matricule = this.sessionService.getActiveUser().matricule;
        eObservation.lastUpdateAuthor.lastName = this.sessionService.getActiveUser().lastName;
        eObservation.lastUpdateAuthor.firstName = this.sessionService.getActiveUser().firstName;
        eObservation.lastUpdateDate = new Date();
        return this.execFunctionService('updateEObservation', eObservation);
    }

    /**
     * Récupère une eObservation à partir de son id
     * @param id l'id de l'eObservation à récupérer
     * @return une promesse contenant l'eObservation récupérée
     */
    public getEObservation(id: number): Promise<EObservationModel> {
        return this.execFunctionService('getEObservation', id);
    }

    /**
     * Récupères les eObsersaction par rédacteur
     * @param matricule matricule du rédacteur
     * @return les eObservations
     */
    public findEObservationsByRedactor(matricule: string): Promise<EObservationModel[]> {
        return this.execFunctionService('findEObservationsByRedactor', matricule);
    }

    /**
     * Récupères les eObsersaction par rédacteur
     * @param version la version du fomulaire epcb
     * @return les niveaux des items référentiels
     */
    public getAllPcbReferentialItemLevelsByVersion(version: string): Promise<ReferentialItemLevelModel[]> {
        return this.execFunctionService('getAllPcbReferentialItemLevelsByVersion', version);
    }

    /**
     * Récupère le PDF d'une eObservation
     * @param id l'id de l'eObservation qu'on souhaite avoir en PDF
     * @return le PDF de l'eObservation
     */
    public getEObservationPdf(id: number): Promise<PdfModel> {
        return this.execFunctionService('getEObservationPdf', id);
    }
}
