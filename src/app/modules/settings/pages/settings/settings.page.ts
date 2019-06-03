import { ProfileManagementPage } from './../../../admin/pages/profile-management/profile-management.page';
import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { TranslateService } from '@ngx-translate/core';
import { NavController, Events, AlertController } from 'ionic-angular';

import { Config } from '../../../../../environments/config';

import { PinPadTypeEnum } from '../../../../core/enums/security/pin-pad-type.enum';
import { SecretQuestionTypeEnum } from '../../../../core/enums/security/secret-question-type.enum';

import { AuthenticatedUserModel } from '../../../../core/models/authenticated-user.model';

import { ImpersonatePage } from '../impersonate/impersonate.page';
import { AppVersionHistoryPage } from '../app-version-history/app-version-history.page';

import { SecurityService } from './../../../../core/services/security/security.service';
import { VersionService } from '../../../../core/services/version/version.service';
import { SecMobilService } from './../../../../core/http/secMobil.service';
import { DeviceService } from '../../../../core/services/device/device.service';
import { ModalSecurityService } from '../../../../core/services/modal/modal-security.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { SynchronizationService } from '../../../../core/services/synchronization/synchronization.service';
import { StorageService } from '../../../../core/storage/storage.service';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { OfflineSecurityService } from '../../../../core/services/security/offline-security.service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.page.html',
})
export class SettingsPage {

  connected: boolean;
  initInProgress: boolean;
  synchronizationInProgress: boolean;
  revokationInProgress: boolean;

  frontVersion: string;
  backVersion: string;

  isApp: boolean;

  constructor(
    private navCtrl: NavController,
    private config: Config,
    private connectivityService: ConnectivityService,
    private storageService: StorageService,
    private events: Events,
    private synchronizationService: SynchronizationService,
    private sessionService: SessionService,
    private toastProvider: ToastService,
    private translateService: TranslateService,
    private alertCtrl: AlertController,
    private securityModalService: ModalSecurityService,
    private deviceService: DeviceService,
    private offlineSecurityProvider: OfflineSecurityService,
    private secMobilService: SecMobilService,
    private appVersion: AppVersion,
    private versionService: VersionService,
    private securityService: SecurityService
  ) {
    this.connected = this.connectivityService.isConnected();

    this.events.subscribe('EDossierOffline:stored', () => {
      this.initInProgress = false;
    });

    this.connectivityService.connectionStatusChange.subscribe(connected => {
      this.connected = connected;
    });

    this.synchronizationService.synchroStatusChange.subscribe(synchroInProgress => {
      this.synchronizationInProgress = synchroInProgress;
    });

    this.isApp = !this.deviceService.isBrowser();
  }

  ionViewDidEnter() {
    this.getFrontAndBackVersion();
  }

  /**
  * Présente une alerte pour confirmer la suppression du cache
  */
  confirmClearAndInitCache() {
    const message = this.synchronizationService.isPncModifiedOffline(this.sessionService.getActiveUser().matricule) ?
      this.translateService.instant('SETTINGS.CONFIRM_INIT_CACHE.MESSAGE_UNSYNCHRONIZED_DATA') :
      this.translateService.instant('SETTINGS.CONFIRM_INIT_CACHE.MESSAGE');

    this.alertCtrl.create({
      title: this.translateService.instant('SETTINGS.CONFIRM_INIT_CACHE.TITLE'),
      message: message,
      buttons: [
        {
          text: this.translateService.instant('SETTINGS.CONFIRM_INIT_CACHE.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translateService.instant('SETTINGS.CONFIRM_INIT_CACHE.CONFIRM'),
          handler: () => this.clearAndInitCache()
        }
      ]
    }).present();
  }

  /**
   * Supprime la totalité du cache puis le réinitialise comme au demarrage de l'application
   */
  clearAndInitCache() {
    this.initInProgress = true;
    this.storageService.reinitOfflineMap().then(() => this.initializeCache());
  }

  /**
   * Réinitialise le cache comme au demarrage de l'application
   */
  initializeCache() {
    this.storageService.initOfflineMap().then(success => {
      const authenticatedUser = this.sessionService.getActiveUser();
      this.offlineSecurityProvider.overwriteAuthenticatedUser(new AuthenticatedUserModel().fromJSON(authenticatedUser));
      this.synchronizationService.storeEDossierOffline(authenticatedUser.matricule).then(successStore => {
        this.events.publish('EDossierOffline:stored');
        this.toastProvider.info(this.translateService.instant('SETTINGS.INIT_CACHE.SUCCESS'));
      }, error => {
      });
    });
  }

  /**
   * Présente une alerte pour confirmer la révocation du certificat
   */
  confirmRevokeCertificate() {
    this.alertCtrl.create({
      title: this.translateService.instant('SETTINGS.CONFIRM_REVOKE_CERTIFICATE.TITLE'),
      message: this.translateService.instant('SETTINGS.CONFIRM_REVOKE_CERTIFICATE.MESSAGE'),
      buttons: [
        {
          text: this.translateService.instant('SETTINGS.CONFIRM_REVOKE_CERTIFICATE.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translateService.instant('SETTINGS.CONFIRM_REVOKE_CERTIFICATE.CONFIRM'),
          handler: () => this.revokeCertificate()
        }
      ]
    }).present();
  }

  /**
   * revoque le certificat sur ipad
   */
  revokeCertificate() {
    this.revokationInProgress = true;
    this.secMobilService.secMobilRevokeCertificate().then(() => {
      this.revokationInProgress = false;
      this.events.publish('user:authenticationLogout');
    });
  }

  forceSynchronizeOfflineData() {
    this.synchronizationService.synchronizeOfflineData();
  }

  /**
   * Affichage du changement de code pin
   */
  changePinCode() {
    this.securityModalService.displayPinPad(PinPadTypeEnum.askChange);
  }

  /**
   * Affichage du changement de question / reponse secréte
   */
  changeSecretQuestion() {
    this.securityModalService.displaySecretQuestion(SecretQuestionTypeEnum.askChange);
  }

  /**
   * Redirige vers la page d'impersonnification
   */
  impersonateNewUser(): void {
    this.navCtrl.push(ImpersonatePage);
  }

  /**
   * Redirige vers la page d'admin
   */
  goToAdminPage() {
    this.navCtrl.push(ProfileManagementPage);
  }

  /**
   * Redirige vers la page d'historique de versions
   */
  goToAppVersionHistory() {
    this.navCtrl.push(AppVersionHistoryPage);
  }

  /**
   * Renvoie la version du front et du back en mode ipad, et seulement la version du back en mode Web
   */
  getFrontAndBackVersion() {
    this.versionService.getBackVersion().then(versionJson => {
      this.backVersion = versionJson['appVersion'];
      if (this.isApp) {
        this.appVersion.getVersionNumber().then(version => this.frontVersion = version);
      } else {
        this.frontVersion = this.config.appVersion;
      }
    }).catch(() => {
      if (this.isApp) {
        this.appVersion.getVersionNumber().then(version => this.frontVersion = version);
      }
    });
  }

  /**
   * Détermine si l'utilisateur connecté est admin
   * @return vrai si c'est le cas, faux sinon
   */
  isAdmin(): boolean {
    return this.securityService.isAdmin(this.sessionService.getActiveUser());
  }

  /**
   * Détermine si l'utilisateur réellement (pas impersonnifié) connecté est admin
   * @return vrai si c'est le cas, faux sinon
   */
  isRealUserAdmin() {
    return this.securityService.isAdmin(this.sessionService.authenticatedUser);
  }

}
