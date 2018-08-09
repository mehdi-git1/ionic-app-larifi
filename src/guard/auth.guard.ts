import { ParametersProvider } from './../providers/parameters/parameters';
import { SecurityProvider } from './../providers/security/security';
import { SessionService } from './../services/session.service';
import { ToastProvider } from './../providers/toast/toast';
import { ConnectivityService } from './../services/connectivity.service';
import { SynchronizationProvider } from './../providers/synchronization/synchronization';
import { StorageService } from './../services/storage.service';
import { NavController } from 'ionic-angular';
import { SecMobilService } from './../services/secMobil.service';
import { TranslateService } from '@ngx-translate/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Injectable, ViewChild } from '@angular/core';

import { AuthenticationPage } from './../pages/authentication/authentication';
import { AuthenticatedUser } from './../models/authenticatedUser';
import { OfflineSecurityProvider } from '../providers/security/offline-security';
import { resolveDefinition } from '../../node_modules/@angular/core/src/view/util';


@Injectable()
export class AuthGuard {

  constructor(
    private secMobilService: SecMobilService,
    private storageService: StorageService,
    private synchronizationProvider: SynchronizationProvider,
    private securityProvider: SecurityProvider,
    private sessionService: SessionService,
    private parametersProvider: ParametersProvider,
    private connectivityService: ConnectivityService,
    private offlineSecurityProvider: OfflineSecurityProvider
  ) {
  }

  guard(launch: boolean = false): Promise<boolean> {
    /**
     * On test pour savoir si on est en mode app
     * Si oui, ce guard ne doit être lancé qu'a l'initialisation
     * Si non, on le lance tout le temps.
     */

    if (launch || this.secMobilService.isBrowser) {
      this.secMobilService.init();
      return this.secMobilService.isAuthenticated().then(() => {
        // Création du stockage local
        return this.storageService.initOfflineMap().then(success => {
          return this.putAuthenticatedUserInSession().then(authenticatedUser => {
            this.initParameters();
            return this.synchronizationProvider.storeEDossierOffline(authenticatedUser.matricule).then(successStore => {
              return true;
            }, error => {
              return true;
            });
          });
        });
      },
        error => {
          return this.secMobilService.isBrowser ? true : false;
        });
    } else {
      return new Promise((resolve, reject) => resolve(true));
    }
  }

  /**
  * Mettre le pnc connecté en session
  */
  putAuthenticatedUserInSession(): Promise<AuthenticatedUser> {
    return new Promise((resolve, reject) => {
      this.securityProvider.getAuthenticatedUser().then(authenticatedUser => {
      if (authenticatedUser) {
        this.sessionService.authenticatedUser = authenticatedUser;       
      }
      resolve(authenticatedUser);
    }, error => {
      console.log(' putAuthenticatedUserInSession error: ' + JSON.stringify(error));
      // this.connectivityService.setConnected(false);
      // this.offlineSecurityProvider.getAuthenticatedUser().then( authenticatedUser => {
      //   this.sessionService.authenticatedUser = authenticatedUser;
      //   resolve(this.sessionService.authenticatedUser);
      // });
    });
  });
  }

  /**
 * Récupère les parametres envoyé par le back
 */
  initParameters() {
    this.parametersProvider.getParams().then(parameters => {
      this.sessionService.parameters = parameters;
    }, error => { });
  }



}

