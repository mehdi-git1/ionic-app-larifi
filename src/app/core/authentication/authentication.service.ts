import { SynchronizationService } from './../services/synchronization/synchronization.service';
import { SessionService } from './../services/session/session.service';
import { Injectable } from '@angular/core';
import { OfflineSecurityService } from '../services/security/offline-security.service';
import { SecurityService } from '../services/security/security.service';
import { AppInitService } from '../services/app-init/app-init.service';
import { DeviceService } from '../services/device/device.service';
import { Events } from 'ionic-angular';

@Injectable()
export class AuthenticationService {

    constructor(
        private sessionService: SessionService,
        private offlineSecurityService: OfflineSecurityService,
        private securityService: SecurityService,
        private appInitService: AppInitService,
        private deviceService: DeviceService,
        private synchronizationService: SynchronizationService,
        private events: Events
    ) { }

    /**
     * Recupère le  user connecté en cache
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
            return true;
        }, error => {
            return false;
        });
    }

    /**
    * Initialise les données de l'utilisateur connecté (ses filtres, son cache etc)
    */
    initUserData(): void {
        this.appInitService.initParameters();
        if (this.deviceService.isOfflineModeAvailable()) {
            this.synchronizationService.synchronizeOfflineData();
            this.synchronizationService.storeEDossierOffline(this.sessionService.getActiveUser().matricule).then(successStore => {
                this.events.publish('EDossierOffline:stored');
            }, error => {
            });
        }
    }
}
