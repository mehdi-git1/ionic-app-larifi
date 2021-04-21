import { Injectable } from '@angular/core';

import {
    EScoreCommentVerbatimEnum
} from '../../enums/business-indicators/escore-comment-verbatim.enum';
import {
    ShortLoopCommentVerbatimEnum
} from '../../enums/business-indicators/short-loop-comment-verbatim.enum';
import {
    BusinessIndicatorLightModel
} from '../../models/business-indicator/business-indicator-light.model';
import {
    BusinessIndicatorSummariesModel
} from '../../models/business-indicator/business-indicator-summaries.model';
import { BusinessIndicatorModel } from '../../models/business-indicator/business-indicator.model';
import { EScoreCommentModel } from '../../models/business-indicator/e-score-comment.model';
import { ShortLoopCommentModel } from '../../models/business-indicator/short-loop-comment.model';

@Injectable()
export class OfflineBusinessIndicatorService {

    constructor() { }
    /**
     * Récupère les indicateurs métier du Pnc
     * @param matricule le matricule du Pnc
     * @return une promesse null car Les indicateurs métiers du PNC sont indisponibles hors ligne
     */
    findPncBusinessIndicators(matricule: string): Promise<BusinessIndicatorLightModel[]> {
        return Promise.resolve(new Array());
    }

    /**
     * Récupère les synthèses des indicateurs métier des 6 derniers mois d'un PNC
     *
     * @param matricule
     *            le matricule du Pnc
     * @return  une promesse null car Les indicateurs métiers du PNC sont indisponibles hors ligne
     */
    getBusinessIndicatorSummaries(matricule: string): Promise<BusinessIndicatorSummariesModel> {
        return Promise.resolve(null);
    }

    /**
     * Récupère un indicateur métier
     * @param id l'id de l'indicateur métier à récupérer
     * @return une promesse null car Les indicateurs métiers du PNC sont indisponibles hors ligne
     */
    getBusinessIndicator(id: number): Promise<BusinessIndicatorModel> {
        return Promise.resolve(null);
    }

    /**
     * Signale un verbatim d'un commentaire eScore
     * @param commentId l'id du commentaire
     * @param commentVerbatim le verbatim du commentaire à signaler
     * @return une promesse contenant le commentaire mis à jour
     */
    reportEScoreCommentVerbatim(commentId: number, commentVerbatim: EScoreCommentVerbatimEnum): Promise<EScoreCommentModel> {
        return Promise.resolve(null);
    }

    /**
     * Signale un verbatim d'un commentaire boucle courte
     * @param commentId l'id du commentaire
     * @param commentVerbatim le verbatim du commentaire à signaler
     * @return une promesse contenant le commentaire mis à jour
     */
    reportShortLoopCommentVerbatim(commentId: number, commentVerbatim: ShortLoopCommentVerbatimEnum): Promise<ShortLoopCommentModel> {
        return Promise.resolve(null);
    }
}
