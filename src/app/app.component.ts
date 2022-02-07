import * as moment from 'moment';
import { AppConstant } from 'src/app/app.constant';
import { Config } from 'src/environments/config';

import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from './core/authentication/authentication.service';
import { EntityEnum } from './core/enums/entity.enum';
import { PinPadTypeEnum } from './core/enums/security/pin-pad-type.enum';
import { PncModel } from './core/models/pnc.model';
import { AppInitService } from './core/services/app-init/app-init.service';
import { AppVersionService } from './core/services/app-version/app-version.service';
import { ConnectivityService } from './core/services/connectivity/connectivity.service';
import { DeviceService } from './core/services/device/device.service';
import { Events } from './core/services/events/events.service';
import { ModalSecurityService } from './core/services/modal/modal-security.service';
import { MyBoardNotificationService } from './core/services/my-board/my-board-notification.service';
import { SessionService } from './core/services/session/session.service';
import { SynchronizationService } from './core/services/synchronization/synchronization.service';
import { ToastService } from './core/services/toast/toast.service';
import { StorageService } from './core/storage/storage.service';
import { Utils } from './shared/utils/utils';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  switchToBackgroundDate: Date;
  pinPadShowupThresholdInSeconds = 120;
  pncSynchroThresholdInSeconds = 300;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private connectivityService: ConnectivityService,
    private events: Events,
    private router: Router,
    private securityModalService: ModalSecurityService,
    private sessionService: SessionService,
    private translateService: TranslateService,
    private deviceService: DeviceService,
    private toastService: ToastService,
    private synchronizationService: SynchronizationService,
    private authenticationService: AuthenticationService,
    private appInitService: AppInitService,
    private alertCtrl: AlertController,
    private config: Config,
    private appVersionService: AppVersionService,
    private myBoardNotificationService: MyBoardNotificationService,
    private storageService: StorageService
  ) {
    this.platform.ready().then(() => {
      this.appInitService.initAppOnIpad().then(() => {
        this.initializeApp();
        if (!this.deviceService.isBrowser()) {
          this.appInitService.handleAuthenticationStatus();
          this.isNewUpdateAvailable();
        }
      }
      );
    });
  }

  initializeApp() {
    // MODE BROWSER
    if (this.deviceService.isBrowser()) {
      if (this.isInternetExplorer()) {
        this.router.navigate(['unsupported-navigator']);
        return;
      }
    } else {
      // MODE MOBILE
      this.statusBar.styleDefault();
      this.platform.resume.subscribe(() => {
        // Si on a depassé le temps d'inactivité, on affiche le pin pad
        if (moment.duration(moment().diff(moment(this.switchToBackgroundDate))).asSeconds() > this.pinPadShowupThresholdInSeconds) {
          if (this.connectivityService.isConnected()) {
            // Synchro des données offline
            let connectedPnc = this.storageService.findOne(EntityEnum.PNC, this.sessionService.getActiveUser().matricule);
            if (!connectedPnc) {
              connectedPnc = new PncModel();
              connectedPnc.matricule = connectedPnc.matricule;
            }
            this.synchronizationService.storeEDossierOffline(connectedPnc);
            // Récupération des compteurs de notifs MyBoard
            this.myBoardNotificationService.updateActiveUserMyBoardNotificationCount();
          }
          if (!this.sessionService.impersonatedUser) {
            this.securityModalService.forceCloseModal();
            this.securityModalService.displayPinPad(PinPadTypeEnum.openingApp);
          }
        }
      });

      /** On ajoute un événement pour savoir si on entre en mode background */
      this.platform.pause.subscribe(() => {
        this.switchToBackgroundDate = new Date();
      });

    }

    this.events.subscribe('connectionStatus:disconnected', () => {
      this.connectivityService.startPingAPI();
    });

    // Détection d'un changement d'état de la connexion
    this.connectivityService.connectionStatusChange.subscribe(connected => {
      if (!connected) {
        this.connectivityService.startPingAPI();
        this.toastService.warning(this.translateService.instant('GLOBAL.CONNECTIVITY.OFFLINE_MODE'));
      } else {
        this.toastService.success(this.translateService.instant('GLOBAL.CONNECTIVITY.ONLINE_MODE'));
        this.authenticationService.offlineManagement();
      }
    });

    this.translateService.setDefaultLang('fr');
    this.translateService.use('fr');
  }

  /**
   * Verifie le type du navigateur utilisé
   *
   * @return vrai si l'application est lancé avec Internet explorer ou edge, faux sinon.
   */
  isInternetExplorer() {
    return navigator.userAgent.search(/(?:Edge|MSIE|Trident\/.*; rv:)/) !== -1;
  }

  /**
   * Vérifie qu'une nouvelle version est disponible
   * Le message est affiché à partir de la date de la MEP + 1
   */
  isNewUpdateAvailable() {
    this.appVersionService.getLastAppVersion().then(lastAppVersion => {
      const lastReleaseDatePlusOneDay = moment(lastAppVersion.releaseDate, AppConstant.isoDateFormat).add(1, 'days');
      if (Utils.compareVersionNumbers(this.config.appVersion, lastAppVersion.number) === -1
        && moment().isAfter(lastReleaseDatePlusOneDay)) {
        this.displayAppVersionToUpdateAlert();
      }
    });
  }
  /**
   * Présente une alerte pour informer l'utilisateur qu'une nouvelle version est disponible
   */
  displayAppVersionToUpdateAlert() {
    this.alertCtrl.create({
      header: this.translateService
        .instant('GLOBAL.APP_VERSION.CONFIRM_VERSION_UPDATE.TITLE'),
      message: this.translateService
        .instant('GLOBAL.APP_VERSION.CONFIRM_VERSION_UPDATE.MESSAGE'),
      buttons: [
        {
          text: this.translateService.instant('GLOBAL.APP_VERSION.CONFIRM_VERSION_UPDATE.OK'),
          role: 'cancel'
        }
      ],
      cssClass: 'app-version-update-alert',
      backdropDismiss: false
    }).then(alert => alert.present());
  }
}
