import { Injectable } from '@angular/core';
import { EDossierPncObject } from '../../models/eDossierPncObject';

@Injectable()
export class OfflineProvider {

  constructor() {
  }

  /**
   * Marque les données comme dispo hors ligne si ces dernières sont en cache
   * @param onlineData les données issues du backend
   * @param offlineData les données issues du stockage local
   */
  flagDataAvailableOffline(onlineData: any, offlineData: any) {
    if (Array.isArray(offlineData)) {
      this.flagEDossierPncObjectArrayAsAvailableOffline(onlineData, offlineData);
    } else if (offlineData !== null) {
      this.flagEDossierPncObjectAsAvailableOffline(onlineData, offlineData);
    }
  }

  /**
   * Marque l'objet EdossierPnc comme dispo offline
   * @param onlineData un objet issu du backend
   * @param offlineData un objet issu du stockage local
   */
  private flagEDossierPncObjectAsAvailableOffline(onlineData: EDossierPncObject, offlineData: EDossierPncObject) {
    if (offlineData && (offlineData.getStorageId() === onlineData.getStorageId())) {
      onlineData.offlineStorageDate = offlineData.offlineStorageDate;
    }
  }

  /**
   * Marque les données comme dispo en hors connexion si celle ci sont retrouvées dans le stockage local de l'appli
   * @param onlineDataArray le tableau contenant les données retournées par le serveur
   * @param offlineDataArray le tableau contenant les données retrouvées en local
   */
  private flagEDossierPncObjectArrayAsAvailableOffline(onlineDataArray: EDossierPncObject[], offlineDataArray: EDossierPncObject[]) {
    for (const onlineData of onlineDataArray) {
      for (const offlineData of offlineDataArray) {
        this.flagEDossierPncObjectAsAvailableOffline(onlineData, offlineData);
      }
    }
  }

}
