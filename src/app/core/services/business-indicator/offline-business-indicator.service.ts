import { Injectable } from '@angular/core';

import {
  EScoreCommentVerbatimEnum
} from '../../enums/business-indicators/escore-comment-verbatim.enum';
import {
  ShortLoopCommentVerbatimEnum
} from '../../enums/business-indicators/short-loop-comment-verbatim.enum';
import { BusinessIndicatorFilterModel } from '../../models/business-indicator/business-indicator-filter-model';
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
   * Récupère les indicateurs métiers du Pnc
   * @param matricule le matricule du Pnc
   * @return une promesse null car Les indicateurs métiers du PNC sont indisponibles hors ligne
   */
  findPncBusinessIndicators(matricule: string): Promise<BusinessIndicatorLightModel[]> {
    return Promise.resolve(new Array());
  }

  /**
   * Récupère les synthèses des indicateurs métiers des 6 derniers mois d'un PNC
   *
   * @param matricule
   *            le matricule du Pnc
   * @return  une promesse null car Les indicateurs métiers du PNC sont indisponibles hors ligne
   */
  getBusinessIndicatorSummaries(matricule: string): Promise<BusinessIndicatorSummariesModel> {
    return Promise.resolve(null);
  }

  /**
   * Récupère les synthèses des indicateurs métiers par poste, pendant les différentes périodes
   * renseignées dans le filtre.
   * @param matricule le matricule du Pnc
   * @param filter es filtres à appliquer à la requête
   * @returns une promesse null car indisponible en offline
   */
  getBusinessIndicatorSummariesByFilter(matricule: string, filter: BusinessIndicatorFilterModel):
    Promise<BusinessIndicatorSummariesModel[]> {
    return Promise.resolve(null);
  }

  /**
   * Récupère les synthèses des indicateurs métiers du pnc et de sa population de référence en fonction
   * du filtre passé en paramètre.
   * @param filter les filtres à appliquer
   * @returns  une promesse null car indisponible en offline
   */
  getBusinessIndicatorSummariesByPopulation(filter: BusinessIndicatorFilterModel): Promise<BusinessIndicatorSummariesModel[]> {
    return Promise.resolve(null);
  }
  /**
   * Récupère un indicateur métiers
   * @param id l'id de l'indicateur métiers à récupérer
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
