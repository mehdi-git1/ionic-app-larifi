import { Entity } from '../../models/entity';
import { StorageService } from '../../../../services/storage.service';
import { Injectable } from '@angular/core';
import { StatutoryCertificate } from '../../models/statutoryCertificate';

@Injectable()
export class OfflineStatutoryCertificateProvider {

  constructor(private storageService: StorageService) {
  }

  /**
   * Récupère l'attestation réglementaire d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer l'attestation réglementaire
   * @return l'attestation réglementaire du PNC
   */
  getStatutoryCertificate(matricule: string): Promise<StatutoryCertificate> {
    return this.storageService.findOneAsync(Entity.STATUTORY_CERTIFICATE, matricule);
  }
}
