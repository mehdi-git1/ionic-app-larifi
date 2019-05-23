import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform, Events, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { PinPadTypeEnum } from './core/enums/security/pin-pad-type.enum';
import { DeviceService } from './core/services/device/device.service';
import { SynchronizationService } from './core/services/synchronization/synchronization.service';
import { ToastService } from './core/services/toast/toast.service';
import { ConnectivityService } from './core/services/connectivity/connectivity.service';
import { SessionService } from './core/services/session/session.service';
import { ModalSecurityService } from './core/services/modal/modal-security.service';
import { AuthenticationService } from './core/authentication/authentication.service';
import { RoutingService } from './core/routing/routing.service';


@Component({
  templateUrl: 'app.html'
})
export class EDossierPNC implements OnInit {

  @ViewChild('content') nav: Nav;

  pinPadModalActive = false;
  switchToBackgroundDate: Date;
  pinPadShowupThresholdInSeconds = 120;
  pncSynchroThresholdInSeconds = 300;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private connectivityService: ConnectivityService,
    private events: Events,
    private securityModalService: ModalSecurityService,
    private sessionService: SessionService,
    public translateService: TranslateService,
    private deviceService: DeviceService,
    private toastService: ToastService,
    private synchronizationProvider: SynchronizationService,
    private authenticationService: AuthenticationService,
    private app: App,
    private routingService: RoutingService) {
    // A chaque changement de page, on récupère l'evenement pour la gestion du changement de tab
    app.viewWillEnter.subscribe(
      (data) => {
        this.events.publish('changeTab', data.component.name);
      }
    );
  }

  ngOnInit(): void {
    this.initializeApp();
  }

  initializeApp() {

    this.platform.ready().then(() => {

      if (!this.deviceService.isBrowser()) {
        /**
        * On ajoute une écoute sur un paramétre pour savoir si la popin est activée ou pas pour afficher un blur
        * et une interdiction de cliquer avant d'avoir mis le bon code pin
        */
        this.securityModalService.modalDisplayed.subscribe(data => {
          this.pinPadModalActive = data;
        });

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

      this.statusBar.styleDefault();

      this.translateService.setDefaultLang('fr');
      this.translateService.use('fr');
      this.authenticationService.initFunctionalApp().then(
        authentReturn => {
          this.routingService.handleAuthenticationStatus(authentReturn, this.nav);
        });
    });

  }
}
