import { SummarySheet } from './../../models/summarySheet';
import { Entity } from './../../models/entity';
import { StorageService } from './../../services/storage.service';
import { Injectable } from '@angular/core';

@Injectable()
export class OfflineSummarySheetProvider {

  constructor(private storageService: StorageService) {
  }

  /**
   * Sauvegarde la fiche synthese d'un PNC dans le cache
   * @param summarySheet la fiche synthese à sauvegarder
   * @return une promesse contenant la fiche synthese sauvée
   */
  save(summarySheet: SummarySheet): Promise<SummarySheet> {
    return this.storageService.saveAsync(Entity.SUMMARY_SHEET, summarySheet);
  }

  /**
   * Récupère la fiche synthese d'un PNC du cache à partir de son matricule
   * @param matricule le matricule du PNC dont on souhaite récupérer la fiche synthese
   * @return une promesse contenant la fiche synthese trouvée
   */
  getSummarySheet(matricule: string): Promise<SummarySheet> {
    return this.storageService.findOneAsync(Entity.SUMMARY_SHEET, matricule);
  }
}
