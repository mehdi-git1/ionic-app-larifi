import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';
import {
  EScoreCommentVerbatimEnum
} from '../../enums/business-indicators/escore-comment-verbatim.enum';
import {
  ShortLoopCommentVerbatimEnum
} from '../../enums/business-indicators/short-loop-comment-verbatim.enum';
import { RestService } from '../../http/rest/rest.base.service';
import {
  BusinessIndicatorFilterModel
} from '../../models/business-indicator/business-indicator-filter-model';
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
export class OnlineBusinessIndicatorService {

  constructor(
    private restService: RestService,
    private config: UrlConfiguration,
  ) { }

  /**
   * Récupère les indicateurs métiers du Pnc
   * @param matricule le matricule du Pnc
   * @param filters filtres à appliquer à la requete
   * @return Les indicateurs métiers du PNC
   */
  findPncBusinessIndicators(matricule: string, filters: BusinessIndicatorFilterModel): Promise<BusinessIndicatorLightModel[]> {
    return this.restService.get(this.config.getBackEndUrl('findPncBusinessIndicators', [matricule]), filters);
  }

  /**
   * Récupère les synthèses des indicateurs métiers des 6 derniers mois d'un PNC
   *
   * @param matricule
   *            le matricule du Pnc
   * @return les synthèses des indicateurs métiers des 6 derniers mois
   */
  getBusinessIndicatorSummaries(matricule: string): Promise<BusinessIndicatorSummariesModel> {
    return this.restService.get(this.config.getBackEndUrl('getBusinessIndicatorSummaries', [matricule]));
  }

  /**
   * Récupère les synthèses des indicateurs métiers par poste, pendant les différentes périodes
   * renseignées dans le filtre.
   * @param matricule le matricule du Pnc
   * @param filter les filtres à appliquer à la requête
   * @returns les synthèses des indicateurs métiers
   */
  getBusinessIndicatorSummariesByFilter(matricule: string, filter: BusinessIndicatorFilterModel):
    Promise<BusinessIndicatorSummariesModel> {
    return this.restService.get(this.config.getBackEndUrl('getBusinessIndicatorSummariesByFilter', [matricule]), filter);
  }

  /**
   * Récupère les synthèses des indicateurs métiers du pnc et de sa population de référence en fonction
   * du filtre passé en paramètre.
   * @param filter les filtres à appliquer
   * @returns les synthèses des indicateurs métiers du pnc et de sa population de référence
   */
  getBusinessIndicatorSummariesByPopulation(filter: BusinessIndicatorFilterModel): Promise<BusinessIndicatorSummariesModel[]> {
    return this.restService.get(this.config.getBackEndUrl('getBusinessIndicatorSummariesByPopulation'), filter);
  }
  /**
   * Récupère un indicateur métier
   * @param id l'id de l'indicateur métier à récupérer
   * @return l'indicateur métier trouvé
   */
  getBusinessIndicator(id: number): Promise<BusinessIndicatorModel> {
    return this.restService.get(this.config.getBackEndUrl('getBusinessIndicator', [id]));
  }

  /**
   * Signale un verbatim d'un commentaire eScore
   * @param commentId l'id du commentaire
   * @param commentVerbatim le verbatim du commentaire à signaler
   * @return une promesse contenant le commentaire mis à jour
   */
  reportEScoreCommentVerbatim(commentId: number, commentVerbatim: EScoreCommentVerbatimEnum): Promise<EScoreCommentModel> {
    return this.restService.put(this.config.getBackEndUrl('reportEScoreCommentVerbatim', [commentId, commentVerbatim]), {});
  }

  /**
   * Signale un verbatim d'un commentaire boucle courte
   * @param commentId l'id du commentaire
   * @param commentVerbatim le verbatim du commentaire à signaler
   * @return une promesse contenant le commentaire mis à jour
   */
  reportShortLoopCommentVerbatim(commentId: number, commentVerbatim: ShortLoopCommentVerbatimEnum): Promise<ShortLoopCommentModel> {
    return this.restService.put(this.config.getBackEndUrl('reportShortLoopCommentVerbatim', [commentId, commentVerbatim]), {});
  }
}
