import { AppVersionTransformerService } from './app-version-transformer.service';
import { StorageService } from '../../storage/storage.service';
import { AppVersionModel } from '../../models/admin/app-version.model';
import { Injectable, EventEmitter } from '@angular/core';
import { SessionService } from '../session/session.service';
import { EntityEnum } from '../../enums/entity.enum';
import { Config } from '../../../../environments/config';

import * as moment from 'moment';
import { DeviceService } from '../device/device.service';


@Injectable()
export class AppVersionAlertService {

  appVersionAlertCreation = new EventEmitter<AppVersionModel>();

  constructor(
    private config: Config,
    private sessionService: SessionService,
    private storageService: StorageService,
    private appVersionTransformerService: AppVersionTransformerService,
    private deviceService: DeviceService
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
   * @param appVersion la version à vérifier
   * @return vrai si la version doit être affichée, faux sinon
   */
  private isAppVersionToDisplay(appVersion: AppVersionModel): boolean {
    const storedAppVersion = this.storageService.findOne(EntityEnum.APP_VERSION, appVersion.number);
    return (!storedAppVersion || !storedAppVersion.number || this.appVersionIsNew(appVersion, storedAppVersion));
  }

  /**
   * Vérifie si la version reçue du serveur est plus récent que celui que l'utilisateur a précédemment vu (celui en cache).
   * @param appVersion la version reçue du serveur
   * @param storedAppVersion la version stockée en cache
   * @return vrai si la version reçue du serveur est plus récente que celle stockée en cache
   */
  private appVersionIsNew(appVersion, storedAppVersion) {
    const actual = appVersion.split('.');
    const stored = storedAppVersion.split('.');
    return Number(actual) > Number(stored);
  }

  /**
   * Masque la version pour les fois suivantes
   * @param appVersion la version qu'on souhaite masquer à l'avenir
   */
  public doNotDisplayMessageAnymore(appVersion: AppVersionModel) {
    this.storageService.saveAsync(EntityEnum.APP_VERSION, this.appVersionTransformerService.toAppVersion(appVersion), true);
  }

  /**
   * Supprime la version utilisée de l'utilisateur en session
   */
  public removeAppVersionFromActiveUser() {
    this.sessionService.getActiveUser().appVersion = undefined;
  }

}
