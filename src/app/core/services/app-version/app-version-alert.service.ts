import { Injectable, EventEmitter } from '@angular/core';

import { EntityEnum } from '../../enums/entity.enum';

import { AppVersionModel } from '../../models/admin/app-version.model';

import { AppVersionTransformerService } from './app-version-transformer.service';
import { StorageService } from '../../storage/storage.service';
import { SessionService } from '../session/session.service';

@Injectable()
export class AppVersionAlertService {

  appVersionAlertCreation = new EventEmitter<AppVersionModel>();

  constructor(
    private sessionService: SessionService,
    private storageService: StorageService,
    private appVersionTransformerService: AppVersionTransformerService
  ) {
  }

  /**
   * Gère l'affichage des versions
   */
  handleAppVersion() {
    const appVersion = this.sessionService.authenticatedUser.appVersion;
    if (appVersion && this.isAppVersionToDisplay(appVersion)) {
      this.displayAppVersion(appVersion);
    }
  }

  /**
   * Affiche une version
   * @param appVersion la version à afficher
   */
  public displayAppVersion(appVersion: AppVersionModel) {
    this.appVersionAlertCreation.emit(appVersion);
  }

  /**
   * Vérifie si la version doit être affichée.
   * Si la version est identique à celle en cache alors on ne l'affichera pas
   * @param appVersion la version à vérifier
   * @return vrai si la version doit être affichée, faux sinon
   */
  private isAppVersionToDisplay(appVersion: AppVersionModel): boolean {
    return !this.storageService.findOne(EntityEnum.APP_VERSION, this.appVersionTransformerService.toAppVersion(appVersion).getStorageId());
  }

  /**
   * Masque la version pour les fois suivantes
   * @param appVersion la version qu'on souhaite masquer à l'avenir
   */
  public doNotDisplayMessageAnymore(appVersion: AppVersionModel) {
    this.storageService.saveAsync(EntityEnum.APP_VERSION, this.appVersionTransformerService.toAppVersion(appVersion), true);
  }

}
