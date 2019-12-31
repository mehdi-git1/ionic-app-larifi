import * as moment from 'moment';
import { HaulTypeEnum } from 'src/app/core/enums/haul-type.enum';
import { SpecialityEnum } from 'src/app/core/enums/speciality.enum';

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppConstant } from '../../../../app.constant';
import {
    BusinessIndicatorModel
} from '../../../../core/models/business-indicator/business-indicator.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    OnlineBusinessIndicatorService
} from '../../../../core/services/business-indicator/online-business-indicator.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';

@Component({
    selector: 'page-business-indicator-detail',
    templateUrl: 'business-indicator-detail.page.html',
    styleUrls: ['./business-indicator-detail.page.scss']
})
export class BusinessIndicatorDetailPage {
    // Le délai en plus qu'on accorde pour le départ navette
    EXTRA_DELAY = 5;

    pnc: PncModel;
    businessIndicator: BusinessIndicatorModel;

    constructor(
        private activatedRoute: ActivatedRoute,
        private pncService: PncService,
        private onlineBusinessIndicatorService: OnlineBusinessIndicatorService
    ) {
        const matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
        const id = +this.activatedRoute.snapshot.paramMap.get('id');
        this.pncService.getPnc(matricule).then(pnc => {
            this.pnc = pnc;
        });

        this.onlineBusinessIndicatorService.getBusinessIndicator(id).then(businessIndicator => {
            this.businessIndicator = businessIndicator;
        });
    }

    /**
     * Vérifie si le bloc "actions à bord" est visible
     * @return vrai si c'est le cas, faux sinon
     */
    isOnBoardActionsAvailable() {
        return !(this.businessIndicator.aboardSpeciality === SpecialityEnum.CC
            && this.businessIndicator.flightDetailsCard.haulType === HaulTypeEnum.LC);
    }

    /**
     * Calcule la date de départ plannifiée du vol d'un indicateur métier : date de départ du tronçon - d0
     * @param businessIndicator l'indicateur métier du vol dont on souhaite calculer la date planifiée
     * @return la date de départ planifiée du vol
     */
    getPlannedDepartureDate(businessIndicator: BusinessIndicatorModel): Date {
        return moment(businessIndicator.flightDetailsCard.legDepartureDate, AppConstant.isoDateFormat)
            .subtract(businessIndicator.flightDetailsCard.d0, 'minutes').toDate();
    }

    /**
     * Calcule le départ navette D0 (on enlève 5 minutes)
     * @return le départ navette D0
     */
    getShuttleDepartureD0(): number {
        return this.businessIndicator.flightDetailsCard.operatingPerformances.shuttleDeparture - this.EXTRA_DELAY;
    }

    /**
     * Vérifie si un indicateur est considéré comme "à l'heure" (inférieur ou égal à 0)
     * @param value la valeur à tester
     * @return vrai si c'est le cas, faux sinon
     */
    isOnTime(value: string): boolean {
        return +value <= 0;
    }

    /**
     * Vérifie si une valeur est considérée comme vide (égale à 0)
     * @param value la valeur à tester
     * @return vrai si c'est le cas, faux sinon
     */
    isEmpty(value: string): boolean {
        return !value || value === '0';
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.pnc !== undefined && this.businessIndicator !== undefined;
    }
}
