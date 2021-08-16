import { Injectable } from '@angular/core';

import {
  EScoreCommentVerbatimEnum
} from '../../enums/business-indicators/escore-comment-verbatim.enum';
import {
  ShortLoopCommentVerbatimEnum
} from '../../enums/business-indicators/short-loop-comment-verbatim.enum';
import {
  BusinessIndicatorFilterModel
} from '../../models/business-indicator/business-indicator-filter-model';
import {
  BusinessIndicatorSummariesModel
} from '../../models/business-indicator/business-indicator-summaries.model';
import { BusinessIndicatorModel } from '../../models/business-indicator/business-indicator.model';
import { EScoreCommentModel } from '../../models/business-indicator/e-score-comment.model';
import {
  PagedBusinessIndicatorModel
} from '../../models/business-indicator/paged-businessIndicator.model';
import { ShortLoopCommentModel } from '../../models/business-indicator/short-loop-comment.model';
import { BaseService } from '../base/base.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { OfflineBusinessIndicatorService } from './offline-business-indicator.service';
import { OnlineBusinessIndicatorService } from './online-business-indicator.service';

@Injectable()
export class BusinessIndicatorService extends BaseService {

  constructor(
    public connectivityService: ConnectivityService,
    private onlineBusinessIndicatorService: OnlineBusinessIndicatorService,
    private offlineBusinessIndicatorService: OfflineBusinessIndicatorService
  ) {
    super(
      connectivityService,
      onlineBusinessIndicatorService,
      offlineBusinessIndicatorService
    );
  }

  /**
   * Récupère les indicateurs métier du Pnc
   * @param matricule le matricule du Pnc
   * @param filters les filtres à appliquer à la requête
   * @return Les indicateurs métiers du PNC
   */
  findPncBusinessIndicators(matricule: string, filters: BusinessIndicatorFilterModel): Promise<PagedBusinessIndicatorModel> {
    return this.execFunctionService('findPncBusinessIndicators', matricule, filters);
  }

  /**
   * Récupère les synthèses des indicateurs métier des 6 derniers mois d'un PNC
   * @param matricule le matricule du Pnc
   * @return les synthèses des indicateurs métier des 6 derniers mois
   */
  getBusinessIndicatorSummaries(matricule: string): Promise<BusinessIndicatorSummariesModel> {
    return this.execFunctionService('getBusinessIndicatorSummaries', matricule);
  }

  /**
   * Récupère les synthèses des indicateurs métier par poste, pendant les différentes périodes
   * renseignées dans le filtre.
   * @param matricule matricule du pnc
   * @param filter les filtres à appliquer à la requête
   * @returns les synthèses des indicateurs
   */
  getBusinessIndicatorSummariesByFilter(matricule: string, filter: BusinessIndicatorFilterModel):
    Promise<BusinessIndicatorSummariesModel[]> {
    return this.execFunctionService('getBusinessIndicatorSummariesByFilter', matricule, filter);
  }

  /**
   * Récupère un indicateur métier
   * @param id l'id de l'indicateur métier à récupérer
   * @return l'indicateur métier trouvé
   */
  getBusinessIndicator(id: number): Promise<BusinessIndicatorModel> {
    return this.execFunctionService('getBusinessIndicator', id);
  }

  /**
   * Signale un verbatim d'un commentaire eScore
   * @param commentId l'id du commentaire
   * @param commentVerbatim le verbatim du commentaire à signaler
   * @return une promesse contenant le commentaire mis à jour
   */
  reportEScoreCommentVerbatim(commentId: number, commentVerbatim: EScoreCommentVerbatimEnum): Promise<EScoreCommentModel> {
    return this.execFunctionService('reportEScoreCommentVerbatim', commentId, commentVerbatim);
  }

  /**
   * Signale un verbatim d'un commentaire boucle courte
   * @param commentId l'id du commentaire
   * @param commentVerbatim le verbatim du commentaire à signaler
   * @return une promesse contenant le commentaire mis à jour
   */
  reportShortLoopCommentVerbatim(commentId: number, commentVerbatim: ShortLoopCommentVerbatimEnum): Promise<ShortLoopCommentModel> {
    return this.execFunctionService('reportShortLoopCommentVerbatim', commentId, commentVerbatim);
  }
}
