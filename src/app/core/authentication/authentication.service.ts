import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

import { SecMobilService } from './../http/secMobil.service';
import { StorageService } from './../storage/storage.service';
import { SynchronizationService } from './../services/synchronization/synchronization.service';
import { SessionService } from './../services/session/session.service';
import { OfflineSecurityService } from '../services/security/offline-security.service';
import { SecurityService } from '../services/security/security.service';
import { AppInitService } from '../services/app-init/app-init.service';
import { DeviceService } from '../services/device/device.service';
import { ConnectivityService } from '../services/connectivity/connectivity.service';
import { AuthenticationStatusEnum } from '../enums/authentication-status.enum';


@Injectable()
export class AuthenticationService {

    constructor(
        private sessionService: SessionService,
        private offlineSecurityService: OfflineSecurityService,
        private securityService: SecurityService,
        private appInitService: AppInitService,
        private deviceService: DeviceService,
        private storageService: StorageService,
        private connectivityService: ConnectivityService,
        private synchronizationService: SynchronizationService,
        private secMobilService: SecMobilService,
        private events: Events
    ) { }

    /**
     * Gestion de la création des données fonctionnelles et leurs gestions dans l'appli
     */
    initFonctionnalApp(): Promise<AuthenticationStatusEnum> {
        // On vérifie si l'utilisateur est connecté à l'application
        return this.isAuthenticated().then(
            data => {
                if (data) {
                    return this.manageUserInformationsInApp();
                } else {
                    return AuthenticationStatusEnum.AUTHENTICATION_KO;
                }
            }
        );
    }

    /**
     * Permet de gérer le stockage des informations user au chargement de l'app
     * ou lors de l'authentification
     */
    manageUserInformationsInApp(): Promise<AuthenticationStatusEnum> {
        // Ensuite on met les données utilisateur en session
        return this.putAuthenticatedUserInSession().then(putOk => {
            if (putOk) {
                let tmpReturn: AuthenticationStatusEnum;
                const authenticatedUser = this.sessionService.getActiveUser();
                // Gestion du mode impersonnifié
                if (this.isInImpersonateMode(authenticatedUser)) {
                    tmpReturn = AuthenticationStatusEnum.IMPERSONATE_MODE;
                } else {
                    tmpReturn = AuthenticationStatusEnum.AUTHENTICATION_OK;
                }
                // Initialisation des paramétres utilisateur en tant que PNC
                if (this.sessionService.getActiveUser().isPnc) {
                    this.initUserData();
                }
                // Si le mode offline est autorisé, on met en place la gestion du offline
                if (this.deviceService.isOfflineModeAvailable()) {
                    return this.offlineManagement().then(result => {
                        if (!result && this.deviceService.isBrowser()) {
                            return AuthenticationStatusEnum.APPLI_UNAVAILABLE;
                        }
                        return AuthenticationStatusEnum.AUTHENTICATION_OK;
                    }, error => {
                        return AuthenticationStatusEnum.INIT_KO;
                    });
                } else {
                    // Ici retour des cas d'affichage hors offline
                    return Promise.resolve(tmpReturn);
                }
            }
        },
            error => AuthenticationStatusEnum.INIT_KO
        );
    }

    /**
     * Permet de voir si on est en mode impersonifié
     * @param authenticatedUser Utilisateur à tester
     */
    isInImpersonateMode(authenticatedUser) {
        return this.securityService.isAdmin(authenticatedUser) && !authenticatedUser.isPnc && !this.sessionService.impersonatedUser;
    }

    /**
     * Gestion de l'authentification dans l'appli via la page d'authentification
     * @param login : login du user
     * @param password : mot de passe
     */
    authenticateUser(login, password): Promise<AuthenticationStatusEnum> {
        return this.secMobilService.authenticate(login, password).then(x => {
            return this.manageUserInformationsInApp();
        }, error => {
            return AuthenticationStatusEnum.AUTHENTICATION_KO;
        });
    }


    /**
     * Recupère le  user connecté en cache et le met en session
     */
    getAuthenticatedUserFromCache(): Promise<boolean> {
        return this.offlineSecurityService.getAuthenticatedUser().then(authenticatedUser => {
            this.sessionService.authenticatedUser = authenticatedUser;
            return true;
        }, error => {
            return false;
        });
    }

    /**
    * Mettre le pnc connecté en session
    */
    putAuthenticatedUserInSession(): Promise<boolean> {
        return this.securityService.getAuthenticatedUser().then(authenticatedUser => {
            if (authenticatedUser) {
                if (this.sessionService.impersonatedUser === null) {
                    this.sessionService.authenticatedUser = authenticatedUser;
                } else {
                    this.sessionService.impersonatedUser = authenticatedUser;
                }
            }
            this.events.publish('user:authenticationDone');
            return true;
        }, errorAuthentication => {
            // Si la recupération ne marche pas et si on est autorisé en offline
            // On récupére l'utilisateur du offline
            if (this.deviceService.isOfflineModeAvailable()) {
                this.connectivityService.setConnected(false);
                return this.getAuthenticatedUserFromCache().then(
                    result => {
                        this.events.publish('user:authenticationDone');
                        return true;
                    },
                    errorGetUser => false
                );
            } else {
                return false;
            }
        });
    }

    /**
    * Initialise les données de l'utilisateur connecté (ses filtres, son cache etc)
    */
    initUserData(): void {
        this.appInitService.initParameters();
    }

    /**
     * Gestion des actions à faire en mode offLine
     */
    offlineManagement(): Promise<boolean> {
        return this.storageService.initOfflineMap().then(success => {
            return this.connectivityService.pingAPI().then(
                pingSuccess => {
                    this.connectivityService.setConnected(true);
                    this.synchronizationService.synchronizeOfflineData();
                    return this.synchronizationService.storeEDossierOffline(this.sessionService.getActiveUser().matricule).then(successStore => {
                        return true;
                    }, error => {
                        return false;
                    });
                }, pingError => {
                    this.connectivityService.setConnected(false);
                    this.connectivityService.startPingAPI();
                    return false;
                });
        });
    }

    /**
     * Vérifie si on est connecté (en fonction du type de device)
     */
    isAuthenticated(): Promise<boolean> {
        if (!this.deviceService.isBrowser()) {
            this.secMobilService.init();
            return this.secMobilService.isAuthenticated().then(() => {
                return true;
            }, error => {
                return false;
            });
        } else {
            return Promise.resolve(true);
        }
    }

}
