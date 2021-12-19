import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '../../authentication/authentication.service';
import { AuthenticationStatusEnum } from '../../enums/authentication-status.enum';
import { PinPadTypeEnum } from '../../enums/security/pin-pad-type.enum';
import { DeviceService } from '../device/device.service';
import { Events } from '../events/events.service';
import { ModalSecurityService } from '../modal/modal-security.service';
import { MyBoardNotificationService } from '../my-board/my-board-notification.service';
import { SessionService } from '../session/session.service';

@Injectable({ providedIn: 'root' })
export class AppInitService {

    authentificationStatus: AuthenticationStatusEnum;

    constructor(
        private events: Events,
        private deviceService: DeviceService,
        private sessionService: SessionService,
        private translateService: TranslateService,
        private authenticationService: AuthenticationService,
        private myBoardNotificationService: MyBoardNotificationService,
        private injector: Injector,
        private platform: Platform
    ) { }

    /**
     * Initialisation de l'appli
     * @return une promesse, résolue quand l'initialisation de l'application est terminée
     */
    initAppOnBrowser(): Promise<any> {
        return this.platform.ready().then(() => {
            if (this.deviceService.isBrowser()) {
                return this.initApp();
            } else {
                return Promise.resolve();
            }
        });
    }

    /**
     * Initialisation de l'appli
     * @return une promesse, résolue quand l'initialisation de l'application est terminée
     */
    initAppOnIpad(): Promise<any> {
        return this.platform.ready().then(() => {
            if (this.deviceService.isBrowser()) {
                return Promise.resolve();
            } else {
                return this.initApp();
            }
        });
    }

    /**
     * Initialisation de l'appli
     * @return une promesse, résolue quand l'initialisation de l'application est terminée
     */
    initApp(): Promise<any> {
        return this.authenticationService.initFunctionalApp().then(
            authentReturn => {
                this.setAuthenticationStatus(authentReturn);
                if (AuthenticationStatusEnum.AUTHENTICATION_OK === authentReturn) {
                    // Récupération des compteurs de notifs MyBoard
                    this.myBoardNotificationService.updateActiveUserMyBoardNotificationCount();
                }
            });
    }

    /**
     * Garde en mémoire le résultat de l'authentification
     * @param authenticationStatus le résultat de l'authentification
     */
    setAuthenticationStatus(authenticationStatus: AuthenticationStatusEnum) {
        this.authentificationStatus = authenticationStatus;
    }

    /**
     * Gestion du routing en fonction du statut de l'authentification passé en paramétre
     */
    handleAuthenticationStatus() {
        /* Obligation d'injecter "manuellement" les services car app-init.service est utilisé dans
         la phase APP_INITIALIZER(voir app.module) */
        const router = this.injector.get(Router);
        const modalSecurityService = this.injector.get(ModalSecurityService);

        if (this.authentificationStatus) {
            switch (this.authentificationStatus) {
                case AuthenticationStatusEnum.AUTHENTICATION_OK:
                    this.events.publish('user:authenticationDone');
                    if (!this.deviceService.isBrowser() && !this.sessionService.impersonatedUser) {
                        modalSecurityService.displayPinPad(PinPadTypeEnum.openingApp);
                    }
                    if (this.sessionService.getActiveUser().isManager) {
                        router.navigate(['tabs', 'home']);
                    } else {
                        router.navigate(['development-program']);
                    }
                    break;
                case AuthenticationStatusEnum.INIT_KO:
                    router.navigate(['generic-message'], {
                        state: {
                            data: { message: this.translateService.instant('GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED') }
                        }
                    });
                    break;
                case AuthenticationStatusEnum.IMPERSONATE_MODE:
                    router.navigate(['admin', 'impersonate']);
                    break;
                case AuthenticationStatusEnum.APPLI_UNAVAILABLE:
                    router.navigate(['generic-message'], {
                        state: {
                            data: { message: this.translateService.instant('GLOBAL.MESSAGES.ERROR.SERVER_APPLICATION_UNAVAILABLE') }
                        }
                    });
                    break;
                case AuthenticationStatusEnum.AUTHENTICATION_KO:
                    router.navigate(['authentication']);
                    break;
                default:
                    router.navigate(['generic-message'], {
                        state: {
                            data: { message: this.translateService.instant('GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED') }
                        }
                    });
            }
        }
    }
}
