import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { SecMobilService } from './../http/secMobil.service';
import { StorageService } from './../storage/storage.service';
import { SynchronizationService } from './../services/synchronization/synchronization.service';
import { SessionService } from './../services/session/session.service';
import { OfflineSecurityService } from '../services/security/offline-security.service';
import { SecurityService } from '../services/security/security.service';
import { DeviceService } from '../services/device/device.service';
import { ConnectivityService } from '../services/connectivity/connectivity.service';
import { AuthenticationStatusEnum } from '../enums/authentication-status.enum';
import { ToastService } from '../services/toast/toast.service';
import { SynchronizationManagementService } from '../services/synchronization/synchronization-management.service';

@Injectable()
export class AuthenticationService {

    constructor(
        private sessionService: SessionService,
        private offlineSecurityService: OfflineSecurityService,
        private securityService: SecurityService,
        private deviceService: DeviceService,
        private storageService: StorageService,
        public translateService: TranslateService,
        private toastService: ToastService,
        private connectivityService: ConnectivityService,
        private synchronizationService: SynchronizationService,
        private synchronizationManagementService: SynchronizationManagementService,
        private secMobilService: SecMobilService
    ) { }

    /**
     * Gére la création des données fonctionnelles et leurs gestions dans l'appli
     */
    initFunctionalApp(): Promise<AuthenticationStatusEnum> {
        // On vérifie si l'utilisateur est connecté à l'application
        return this.isAuthenticated().then(
            data => {
                if (data) {
                    return this.storageService.initOfflineMap().then(success => {
                        return this.manageUserInformationsInApp();
                    });
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
        // On met les données utilisateur en session
        return this.putAuthenticatedUserInSession().then(isPutOk => {
            if (isPutOk) {
                return this.initializeUser();
            }
        },
            error => {
                if (error) {
                    return this.initializeUser();
                } else {
                    return AuthenticationStatusEnum.INIT_KO;
                }
            }
        );
    }

    /**
     * Gére la façon d'initialiser l'utilisateur
     * @return Retourne le statut de l'authentification (appli / user)
     */
    initializeUser(): Promise<AuthenticationStatusEnum> {
        const authenticatedUser = this.sessionService.getActiveUser();
        // Gestion du mode impersonnifié
        if (this.userHaveToImpersonate(authenticatedUser)) {
            return Promise.resolve(AuthenticationStatusEnum.IMPERSONATE_MODE);
        }
        // Si le mode offline est autorisé, on met en place la gestion du offline
        if (this.deviceService.isOfflineModeAvailable()) {
            this.offlineManagement().then(result => {
                this.synchronizationService.storeEDossierOffline(this.sessionService.getActiveUser().matricule);
                if (!result && this.deviceService.isBrowser()) {
                    this.toastService.warning(this.translateService.instant('GLOBAL.MESSAGES.ERROR.SERVER_APPLICATION_UNAVAILABLE'));
                }
            }, error => {
                this.toastService.warning(this.translateService.instant('GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED'));
            });
        }
        return Promise.resolve(AuthenticationStatusEnum.AUTHENTICATION_OK);
    }

    /**
     * Permet de voir si l'utilisateur doit être en mode impersonifié
     * @param authenticatedUser Utilisateur à tester
     */
    userHaveToImpersonate(authenticatedUser) {
        return this.securityService.isAdmin(authenticatedUser) && !authenticatedUser.isPnc && !this.sessionService.impersonatedUser;
    }

    /**
     * Gére l'authentification dans l'appli via la page d'authentification
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
    * Met le pnc connecté en session
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
            return true;
        }, errorAuthentication => {
            // Si la recupération ne marche pas et si on est autorisé en offline
            // On récupére l'utilisateur du offline
            if (this.deviceService.isOfflineModeAvailable()) {
                this.connectivityService.setConnected(false);
                return this.getAuthenticatedUserFromCache().then(
                    result => {
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
     * Gére les actions à faire en mode offLine
     */
    offlineManagement(): Promise<boolean> {
        return this.connectivityService.pingAPI().then(
            pingSuccess => {
                this.connectivityService.setConnected(true);
                this.synchronizationService.synchronizeOfflineData();
                this.synchronizationManagementService.resumeSynchroRequestProcessing(true);
                return true;
            }, pingError => {
                this.connectivityService.setConnected(false);
                this.connectivityService.startPingAPI();
                return false;
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
