import { DeviceService } from './../../services/device.service';
import { PinPadType, SecretQuestionType } from './../../models/securityModalType';
import { SecurityModalService } from './../../services/security.modal.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastProvider } from './../../providers/toast/toast';
import { UpcomingFlightListPage } from './../upcoming-flight-list/upcoming-flight-list';
import { SessionService } from './../../services/session.service';
import { ParametersProvider } from './../../providers/parameters/parameters';
import { SynchronizationProvider } from './../../providers/synchronization/synchronization';
import { StorageService } from './../../services/storage.service';
import { AuthenticationPage } from './../authentication/authentication';
import { SecMobilService } from './../../services/secMobil.service';
import { ConnectivityService } from './../../services/connectivity.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  connected: boolean;
  initInProgress: boolean;
  synchronizationInProgress: boolean;

  isApp: boolean;

  constructor(
    private connectivityService: ConnectivityService,
    private storageService: StorageService,
    private events: Events,
    private synchronizationProvider: SynchronizationProvider,
    private sessionService: SessionService,
    private toastProvider: ToastProvider,
    private translateService: TranslateService,
    private alertCtrl: AlertController,
    private securityModalService: SecurityModalService,
    private deviceService: DeviceService

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

    this.isApp = this.deviceService.isBrowser();
  }

  ionViewDidLoad() {
  }

  /**
  * Présente une alerte pour confirmer la suppression du brouillon
  */
  confirmClearAndInitCache() {
    const message = this.synchronizationProvider.isPncModifiedOffline(this.sessionService.authenticatedUser.matricule) ?
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
      const authenticatedUser = this.sessionService.authenticatedUser;
      this.synchronizationProvider.storeEDossierOffline(authenticatedUser.matricule).then(successStore => {
        this.events.publish('EDossierOffline:stored');
        this.toastProvider.info(this.translateService.instant('SETTINGS.INIT_CACHE.SUCCESS'));
      }, error => {
      });
    });
  }

  forceSynchronizeOfflineData() {
    this.synchronizationProvider.synchronizeOfflineData();
  }

  /**
   * Fonction d'affichage du changement de code pin
   */
  changePinCode(){
    this.securityModalService.displayPinPad(PinPadType.askChange);
  }

  /**
   * Fonction d'affichage du changement de question / reponse secréte
   */
  changeSecretQuestion(){
    this.securityModalService.displaySecretQuestion(SecretQuestionType.askChange);
  }

}
