import { SecMobilService } from './../../../../core/http/secMobil.service';
import { AuthenticationPage } from './../../../home/pages/authentication/authentication.page';
import { AdminHomePage } from '../admin/home/admin-home.page';
import { ImpersonatePage } from '../impersonate/impersonate.page';
import { DeviceService } from '../../../../core/services/device/device.service';
import { ModalSecurityService } from '../../../../core/services/modal/modal-security.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { SynchronizationService } from '../../../../core/services/synchronization/synchronization.service';
import { StorageService } from '../../../../core/storage/storage.service';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { Component } from '@angular/core';
import { NavController, Events, AlertController } from 'ionic-angular';

import { PinPadTypeEnum } from '../../../../core/enums/security/pin-pad-type.enum';
import { SecretQuestionTypeEnum } from '../../../../core/enums/security/secret-question-type.enum';
import { AuthenticatedUserModel } from '../../../../core/models/authenticated-user.model';
import { OfflineSecurityService } from '../../../../core/services/security/offline-security.service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.page.html',
})
export class SettingsPage {

  connected: boolean;
  initInProgress: boolean;
  synchronizationInProgress: boolean;

  isApp: boolean;

  constructor(
    private navCtrl: NavController,
    private connectivityService: ConnectivityService,
    private storageService: StorageService,
    private events: Events,
    private synchronizationProvider: SynchronizationService,
    private sessionService: SessionService,
    private toastProvider: ToastService,
    private translateService: TranslateService,
    private alertCtrl: AlertController,
    private securityModalService: ModalSecurityService,
    private deviceService: DeviceService,
    private offlineSecurityProvider: OfflineSecurityService,
    private secMobilService: SecMobilService
  ) {
    this.connected = this.connectivityService.isConnected();

    this.events.subscribe('EDossierOffline:stored', () => {
      this.initInProgress = false;
    });

    this.connectivityService.connectionStatusChange.subscribe(connected => {
      this.connected = connected;
    });

    this.synchronizationProvider.synchroStatusChange.subscribe(synchroInProgress => {
      this.synchronizationInProgress = synchroInProgress;
    });

    this.isApp = !this.deviceService.isBrowser();
  }

  ionViewDidLoad() {
  }

  /**
  * Présente une alerte pour confirmer la suppression du cache
  */
  confirmClearAndInitCache() {
    const message = this.synchronizationProvider.isPncModifiedOffline(this.sessionService.getActiveUser().matricule) ?
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
      this.synchronizationProvider.storeEDossierOffline(authenticatedUser.matricule).then(successStore => {
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
          handler: () => this.RevokeCertificate()
        }
      ]
    }).present();
  }

  /**
   * revoque le certificat sur ipad
   */
  RevokeCertificate() {
    this.secMobilService.secMobilRevokeCertificate().then(() => {    
      this.events.publish('user:authenticationFailed');
    });
  }

  forceSynchronizeOfflineData() {
    this.synchronizationProvider.synchronizeOfflineData();
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
    // On autorise l'impersonification uniquement si on se trouve sur la première stack de navigation (premier onglet)
    if (this.navCtrl.parent.getSelected().id == 't0-0') {
      this.navCtrl.push(ImpersonatePage);
    } else {
      this.toastProvider.error(this.translateService.instant('SETTINGS.IMPERSONATE_USER.FIRST_NAV_TAB_IS_MANDATORY'));
    }
  }

  /**
   * Redirige vers la page d'admin
   */
  goToAdminPage() {
    this.navCtrl.push(AdminHomePage);
  }

}
