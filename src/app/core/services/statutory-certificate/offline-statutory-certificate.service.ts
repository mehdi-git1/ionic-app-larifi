import { Injectable } from '@angular/core';

import { EntityEnum } from '../../enums/entity.enum';
import { StorageService } from '../../storage/storage.service';
import { StatutoryCertificateModel } from '../../models/statutory.certificate.model';

@Injectable()
export class OfflineStatutoryCertificateService {

  constructor(private storageService: StorageService) {
  }

  /**
   * Récupère l'attestation réglementaire d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer l'attestation réglementaire
   * @return l'attestation réglementaire du PNC
   */
  getStatutoryCertificate(matricule: string): Promise<StatutoryCertificateModel> {
    return this.storageService.findOneAsync(EntityEnum.STATUTORY_CERTIFICATE, matricule);
  }
}
