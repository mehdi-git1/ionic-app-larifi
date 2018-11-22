import { Injectable } from '@angular/core';

import { SummarySheetModel } from '../../models/summary.sheet.model';
import { EntityEnum } from '../../enums/entity.enum';
import { StorageService } from '../../storage/storage.service';

@Injectable()
export class OfflineSummarySheetService {

  constructor(private storageService: StorageService) {
  }

  /**
   * Sauvegarde la fiche synthese d'un PNC dans le cache
   * @param summarySheet la fiche synthese à sauvegarder
   * @return une promesse contenant la fiche synthese sauvée
   */
  save(summarySheet: SummarySheetModel): Promise<SummarySheetModel> {
    return this.storageService.saveAsync(EntityEnum.SUMMARY_SHEET, summarySheet);
  }

  /**
   * Récupère la fiche synthese d'un PNC du cache à partir de son matricule
   * @param matricule le matricule du PNC dont on souhaite récupérer la fiche synthese
   * @return une promesse contenant la fiche synthese trouvée
   */
  getSummarySheet(matricule: string): Promise<SummarySheetModel> {
    return this.storageService.findOneAsync(EntityEnum.SUMMARY_SHEET, matricule);
  }
}
