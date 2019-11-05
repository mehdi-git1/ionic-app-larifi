import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Events } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationStatusEnum } from '../../enums/authentication-status.enum';
import { PinPadTypeEnum } from '../../enums/security/pin-pad-type.enum';
import { DeviceService } from '../device/device.service';
import { ModalSecurityService } from '../modal/modal-security.service';
import { SessionService } from '../session/session.service';

@Injectable({ providedIn: 'root' })
export class AppInitService {

    constructor(
        private events: Events,
        private router: Router,
        private deviceService: DeviceService,
        private sessionService: SessionService,
        private modalSecurityService: ModalSecurityService,
        private translateService: TranslateService) { }

    /**
     * Initialisation de l'appli
     * @return une promesse, résolue quand l'initialisation de l'application est terminée
     */
    initApp(): Promise<any> {
        return Promise.resolve();
    }

    /**
     * Gestion du routing en fonction du statut de l'authentification passé en paramétre
     * @param authentificationStatus le statut de l'authentification
     */
    handleAuthenticationStatus(authentificationStatus: AuthenticationStatusEnum) {
        switch (authentificationStatus) {
            case AuthenticationStatusEnum.AUTHENTICATION_OK:
                this.events.publish('user:authenticationDone');
                if (!this.deviceService.isBrowser() && !this.sessionService.impersonatedUser) {
                    this.modalSecurityService.displayPinPad(PinPadTypeEnum.openingApp);
                }
                if (this.sessionService.getActiveUser().isManager) {
                    this.router.navigate(['tabs', 'home']);
                } else {
                    this.router.navigate(['career-objective']);
                }
                break;
            case AuthenticationStatusEnum.INIT_KO:
                this.router.navigate(['generic-message'], {
                    state: {
                        data: { message: this.translateService.instant('GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED') }
                    }
                });
                break;
            case AuthenticationStatusEnum.IMPERSONATE_MODE:
                this.router.navigate(['admin', 'impersonate']);
                break;
            case AuthenticationStatusEnum.APPLI_UNAVAILABLE:
                this.router.navigate(['generic-message'], {
                    state: {
                        data: { message: this.translateService.instant('GLOBAL.MESSAGES.ERROR.SERVER_APPLICATION_UNAVAILABLE') }
                    }
                });
                break;
            case AuthenticationStatusEnum.AUTHENTICATION_KO:
                this.router.navigate(['authentication']);
                break;
            default:
                this.router.navigate(['generic-message'], {
                    state: {
                        data: { message: this.translateService.instant('GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED') }
                    }
                });
        }
    }

}
