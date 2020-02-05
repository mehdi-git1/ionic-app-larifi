import * as moment from 'moment';
import { HaulTypeEnum } from 'src/app/core/enums/haul-type.enum';
import { SpecialityEnum } from 'src/app/core/enums/speciality.enum';

import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { AppConstant } from '../../../../app.constant';
import {
    BusinessIndicatorModel
} from '../../../../core/models/business-indicator/business-indicator.model';
import {
    EScoreCommentModel
} from '../../../../core/models/business-indicator/e-score-comment.model';
import {
    ShortLoopCommentModel
} from '../../../../core/models/business-indicator/short-loop-comment.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    OnlineBusinessIndicatorService
} from '../../../../core/services/business-indicator/online-business-indicator.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { Utils } from '../../../../shared/utils/utils';
import {
    BusinessIndicatorPerfopsLegendComponent
} from '../../components/business-indicator-perfops-legend/business-indicator-perfops-legend.component';

const ratingImagePath = 'assets/imgs/business-indicators/smiley-note-';

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
    escoreCommentColumns: string[] = ['rating', 'positiveFeedbackReason', 'negativeFeedbackReason', 'suggestions'];
    shortLoopCommentColumns: string[] = ['rating', 'positiveFeedbackReason', 'negativeFeedbackReason'];

    // On expose le composant pour le passer en input du composant edospnc-expandable-content dans le template html
    BusinessIndicatorPerfopsLegendComponent = BusinessIndicatorPerfopsLegendComponent;

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
            const escoreCommentsFiltered = this.filterValidEScoreComments(businessIndicator.escoreComments);
            escoreCommentsFiltered.sort((escoreComment, otherEscoreComment) => {
                return this.sortEscoreCommentByRating(escoreComment, otherEscoreComment);
            });
            this.escoreCommentsDataSource = new MatTableDataSource<EScoreCommentModel>(escoreCommentsFiltered);
            const shortLoopCommentsFiltered = this.filterValidShortLoopComments(businessIndicator.shortLoopComments);
            shortLoopCommentsFiltered.sort((shortLoopComment, otherShortLoopComment) => {
                return this.sortShortLoopCommentCommentByRating(shortLoopComment, otherShortLoopComment);
            });
            this.shortLoopCommentsDataSource = new MatTableDataSource<ShortLoopCommentModel>(shortLoopCommentsFiltered);
        });
    }

    /**
     * Tri décroissant des commentaires eScore par note
     * @param escoreComment commentaire eScore de base
     * @param otherEscoreComment commentaire eScore à comparer
     */
    sortEscoreCommentByRating(escoreComment: EScoreCommentModel, otherEscoreComment: EScoreCommentModel): number {
        return escoreComment.rating < otherEscoreComment.rating ? 1 : -1;
    }

    /**
     * Tri décroissant des commentaires boucle courte par note
     * @param shortLoopComment commentaire boucle courte de base
     * @param otherShortLoopComment commentaire boucle courte à comparer
     */
    sortShortLoopCommentCommentByRating(shortLoopComment: ShortLoopCommentModel, otherShortLoopComment: ShortLoopCommentModel): number {
        return shortLoopComment.rating < otherShortLoopComment.rating ? 1 : -1;
    }

    /**
     * Filter les commentaires eScore valides
     * @param escoreComments tableau de commentaires eScore
     * @return tableau de commentaires eScore valides
     */
    filterValidEScoreComments(escoreComments: Array<EScoreCommentModel>) {
        return escoreComments.filter(
            escoreComment =>
                !(Utils.isEmpty(escoreComment.positivePersonalFeedbackReason) &&
                    Utils.isEmpty(escoreComment.negativePersonalFeedbackReason) &&
                    Utils.isEmpty(escoreComment.suggestions))
        );
    }

    /**
     * Filter les commentaires boucle courte valides
     * @param shortLoopComments tableau de commentaires boucle courte
     * @return tableau de commentaires boucle courte valides
     */
    filterValidShortLoopComments(shortLoopComments: Array<ShortLoopCommentModel>) {
        return shortLoopComments.filter(
            shortLoopComment =>
                !(Utils.isEmpty(shortLoopComment.appreciatedPoints) &&
                    Utils.isEmpty(shortLoopComment.pointsToImprove))
        );
    }
    /**
     * Vérifie si le bloc "actions à bord" est visible
     * @return vrai si c'est le cas, faux sinon
     */
    isOnBoardActionsAvailable() {
        return !(this.businessIndicator.aboardSpeciality === SpecialityEnum.CC
            && this.businessIndicator.flight.haulType === HaulTypeEnum.LC);
    }

    /**
     * Calcule la date de départ plannifiée du vol d'un indicateur métier : date de départ du tronçon - d0
     * @param businessIndicator l'indicateur métier du vol dont on souhaite calculer la date planifiée
     * @return la date de départ planifiée du vol
     */
    getPlannedDepartureDate(businessIndicator: BusinessIndicatorModel): Date {
        return moment(businessIndicator.flight.legDepartureDate, AppConstant.isoDateFormat)
            .subtract(businessIndicator.flight.d0, 'minutes').toDate();
    }

    /**
     * Calcule le départ navette D0 (on enlève 5 minutes)
     * @return le départ navette D0
     */
    getShuttleDepartureD0(): number {
        return this.businessIndicator.flight.operatingPerformance.shuttleDeparture === undefined ?
            undefined
            : this.businessIndicator.flight.operatingPerformance.shuttleDeparture - this.EXTRA_DELAY;
    }

    /**
     * Vérifie si un indicateur est considéré comme "à l'heure" (inférieur ou égal à 0)
     * @param value la valeur à tester
     * @return vrai si c'est le cas, faux sinon
     */
    isOnTime(value: any): boolean {
        return +value <= 0;
    }

    /**
     * Vérifie si une valeur est considérée comme vide (égale à 0)
     * @param value la valeur à tester
     * @return vrai si c'est le cas, faux sinon
     */
    isEmptyOrZero(value: any): boolean {
        return !value || value === '0';
    }

    /**
     * Vérifie si une valeur est null/vide
     * @param value la valeur à tester
     * @return vrai si c'est le cas, faux sinon
     */
    isEmpty(value: any): boolean {
        return value === undefined;
    }

    /**
     * Retourne la valeur absolue du nombre
     * @param value le nombre à transformer
     * @return la valeur absolue du nombre
     */
    absoluteValue(value: number): number {
        return Math.abs(value);
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
     * @param rating note
     * @return le chemin vers le fichier de l'icone
     */
    getEscoreCommentRatingImagePath(rating: number) {
        return ratingImagePath + rating * 10 + '.svg';
    }

    /**
     * Crée un tableau vide de la taille du paramètre rating
     * @param rating note
     * @return le tableau
     */
    getRatingArray(rating: number): Array<any> {
        if (!rating || rating <= 0) {
            return new Array();
        }
        return new Array(rating);
    }

    /**
     * Détermine si les commentaires boucles courte sont affichés ou pas
     * (en fonction de la spécialité du Pnc à bord et du type de vol)
     * @return true si on doit les afficher, false sinon
     */
    canDisplayShortLoopComment(): boolean {
        const isCcpAndLcFlight = this.businessIndicator.aboardSpeciality === SpecialityEnum.CCP
            && this.businessIndicator.flight.haulType === HaulTypeEnum.LC;
        const isCcAndCcOrMcFlight = this.businessIndicator.aboardSpeciality === SpecialityEnum.CC
            && (this.businessIndicator.flight.haulType === HaulTypeEnum.CC
                || this.businessIndicator.flight.haulType === HaulTypeEnum.MC);
        return isCcpAndLcFlight || isCcAndCcOrMcFlight;
    }
}
