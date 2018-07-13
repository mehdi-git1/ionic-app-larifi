import { SummarySheet } from './../../models/summarySheet';
import { Entity } from './../../models/entity';
import { StorageService } from './../../services/storage.service';
import { Injectable } from '@angular/core';

@Injectable()
export class OfflineSummarySheetProvider {

  constructor(private storageService: StorageService) {
  }

  /**
   * Sauvegarde un PNC dans le cache
   * @param pnc le PNC à sauvegarder
   * @return une promesse contenant le PNC sauvé
   */
  save(summarySheet: SummarySheet): Promise<SummarySheet> {
    return this.storageService.saveAsync(Entity.SUMMARY_SHEET, summarySheet);
  }

  /**
   * Récupère un PNC du cache à partir de son matricule
   * @param matricule le matricule du PNC qu'on souhaite récupérer
   * @return une promesse contenant le PNC trouvé
   */
  getSummarySheet(matricule: string): Promise<SummarySheet> {
    return this.storageService.findOneAsync(Entity.SUMMARY_SHEET, matricule);
  }
}
