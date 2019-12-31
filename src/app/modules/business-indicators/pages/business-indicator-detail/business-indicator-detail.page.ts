import { Utils } from './../../../../shared/utils/utils';
import { MatTableDataSource } from '@angular/material';
import { ShortLoopCommentModel } from './../../../../core/models/business-indicator/short-loop-comment.model';
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
import { DataSource } from '@angular/cdk/table';
import { EScoreCommentModel } from '../../../../core/models/business-indicator/e-score-comment.model';


const notationImagePath = 'assets/imgs/business-indicators/smiley-note-';

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
    shortLoopCommentsDataSource: MatTableDataSource<ShortLoopCommentModel>;
    escoreCommentsDataSource: MatTableDataSource<EScoreCommentModel>;
    escoreCommentColumns: string[] = ['notation', 'positiveFeedbackReason', 'negativeFeedbackReason', 'suggestions'];
    shortLoopCommentColumns: string[] = ['notation', 'positiveFeedbackReason', 'negativeFeedbackReason'];
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
            const escoreCommentsFiltered = businessIndicator.flightDetailsCard.escoreComments.filter(
                escoreComment =>
                !(Utils.isEmpty(escoreComment.positivePersonalFeedbackReason) &&
                Utils.isEmpty(escoreComment.negativePersonalFeedbackReason) &&
                Utils.isEmpty(escoreComment.suggestions))
            );
            escoreCommentsFiltered.sort((a, b) => {
                return (a.notation < b.notation ? 1 : -1);
            });
            this.escoreCommentsDataSource = new MatTableDataSource<EScoreCommentModel>(escoreCommentsFiltered);
            const shortLoopCommentsFiltered = businessIndicator.flightDetailsCard.shortLoopComments.filter(
                shortLoopComment =>
                !(Utils.isEmpty(shortLoopComment.appreciatedPoints) &&
                Utils.isEmpty(shortLoopComment.pointsToImprove))
            );
            shortLoopCommentsFiltered.sort((a, b) => {
                return (a.notation < b.notation ? 1 : -1);
            });
            this.shortLoopCommentsDataSource = new MatTableDataSource<ShortLoopCommentModel>(shortLoopCommentsFiltered);
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
    isEmpty(value: any): boolean {
        return !value || value === '0';
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.pnc !== undefined && this.businessIndicator !== undefined;
    }

    /**
     * Crée le chemin vers le fichier de l'icone de note escore
     * @param notation note
     * @return le chemin vers le fichier de l'icone
     */
    getEscoreCommentNotationImagePath(notation: number) {
        return notationImagePath + notation * 10 + '.svg';
    }

    /**
     * Crée un tableau vide de la taille du paramètre notation
     * @param notation note
     * @return le tableau
     */
    getNotationArray(notation: number): Array<any> {
        if (!notation || notation <= 0 ) {
            return new Array();
        }
        return new Array(notation);
    }

    canDisplayShortLoopComment(): boolean {
        const isCcpAndLcFlight = this.businessIndicator.aboardSpeciality === SpecialityEnum.CCP
        && this.businessIndicator.flightDetailsCard.haulType === HaulTypeEnum.LC;
        const isCcAndCcOrMcFlight = this.businessIndicator.aboardSpeciality === SpecialityEnum.CC
        && (this.businessIndicator.flightDetailsCard.haulType === HaulTypeEnum.CC
            || this.businessIndicator.flightDetailsCard.haulType === HaulTypeEnum.MC);
        return isCcpAndLcFlight  || isCcAndCcOrMcFlight;

    }
}
