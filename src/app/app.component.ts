import * as moment from 'moment';
import { Config } from 'src/environments/config';

import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AlertController, Events, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AppConstant } from './app.constant';
import { AuthenticationService } from './core/authentication/authentication.service';
import { PinPadTypeEnum } from './core/enums/security/pin-pad-type.enum';
import { AppInitService } from './core/services/app-init/app-init.service';
import { AppVersionService } from './core/services/app-version/app-version.service';
import { ConnectivityService } from './core/services/connectivity/connectivity.service';
import { DeviceService } from './core/services/device/device.service';
import { ModalSecurityService } from './core/services/modal/modal-security.service';
import { SessionService } from './core/services/session/session.service';
import { SynchronizationService } from './core/services/synchronization/synchronization.service';
import { ToastService } from './core/services/toast/toast.service';

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
  today = new Date();
  afStoreUrl = 'https://afstore.airfrance.fr/Catalog/ViewCatalog/glpeBe1JE9xMYYOZeLSRz2CuQBLw4DUiiXeiaLQFUVmypdXDVrMkicbCf8UHDW26/Apple';

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
    private synchronizationProvider: SynchronizationService,
    private authenticationService: AuthenticationService,
    private appInitService: AppInitService,
    private alertCtrl: AlertController,
    private config: Config,
    private appVersionService: AppVersionService
  ) {
    this.platform.ready().then(() => {
      this.appInitService.initAppOnIpad().then(() => {
        this.initializeApp();
        if (!this.deviceService.isBrowser()) {
          this.appInitService.handleAuthenticationStatus();
          this.NewUpdateIsAvailable();
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
            this.synchronizationProvider.storeEDossierOffline(this.sessionService.authenticatedUser.matricule);
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
  NewUpdateIsAvailable() {
    this.appVersionService.getLastAppVersion().then(lastAppVersion => {
      const dayAfterRelease = moment(lastAppVersion.releaseDate, AppConstant.isoDateFormat).toDate().getDate() + 1;
      if (lastAppVersion.number !== this.config.appVersion && this.today >= moment(dayAfterRelease, AppConstant.isoDateFormat).toDate()) {
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
        .instant('GLOBAL.APP_VERSION.CONFIRM_VERSION_UPDATE.MESSAGE', { number: this.config.appVersion }),
      buttons: [
        {
          text: this.translateService.instant('GLOBAL.APP_VERSION.CONFIRM_VERSION_UPDATE.NOW'),
          handler: () => window.open(this.afStoreUrl, '_system', 'location=yes')
        },
        {
          text: this.translateService.instant('GLOBAL.APP_VERSION.CONFIRM_VERSION_UPDATE.CLOSE'),
          role: 'cancel'
        }
      ],
      cssClass: 'app-version-update-alert',
      backdropDismiss: false
    }).then(alert => alert.present());
  }
}
