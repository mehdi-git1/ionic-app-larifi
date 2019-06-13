import { CareerObjectiveListPage } from './../../modules/development-program/pages/career-objective-list/career-objective-list.page';
import { AuthenticationPage } from './../../modules/home/pages/authentication/authentication.page';
import { TranslateService } from '@ngx-translate/core';
import { ImpersonatePage } from './../../modules/settings/pages/impersonate/impersonate.page';
import { GenericMessagePage } from './../../modules/home/pages/generic-message/generic-message.page';
import { PncHomePage } from './../../modules/home/pages/pnc-home/pnc-home.page';
import { ModalSecurityService } from './../services/modal/modal-security.service';
import { PinPadTypeEnum } from './../enums/security/pin-pad-type.enum';
import { DeviceService } from './../services/device/device.service';
import { AuthenticationStatusEnum } from './../enums/authentication-status.enum';
import { Injectable } from '@angular/core';
import { Events, NavController } from 'ionic-angular';
import { SessionService } from '../services/session/session.service';

@Injectable()
export class RoutingService {

    constructor(private events: Events,
        private deviceService: DeviceService,
        private sessionService: SessionService,
        private modalSecurityService: ModalSecurityService,
        private translateService: TranslateService) { }

    /**
     * Gestion du routing en fonction du statut de l'authentification passé en paramétre
     * @param authentificationStatus le statut de l'authentification
     * @param navCtrl le controleur de navigation à utiliser pour le routage
     */
    handleAuthenticationStatus(authentificationStatus: AuthenticationStatusEnum, navCtrl: NavController) {
        switch (authentificationStatus) {
            case AuthenticationStatusEnum.AUTHENTICATION_OK:
                this.events.publish('user:authenticationDone');
                if (!this.deviceService.isBrowser() && !this.sessionService.impersonatedUser) {
                    this.modalSecurityService.displayPinPad(PinPadTypeEnum.openingApp);
                }
                navCtrl.setRoot(this.sessionService.getActiveUser().isManager ? PncHomePage : CareerObjectiveListPage, { matricule: this.sessionService.getActiveUser().matricule });
                break;
            case AuthenticationStatusEnum.INIT_KO:
                navCtrl.setRoot(GenericMessagePage, { message: this.translateService.instant('GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED') });
                break;
            case AuthenticationStatusEnum.IMPERSONATE_MODE:
                navCtrl.setRoot(ImpersonatePage);
                break;
            case AuthenticationStatusEnum.APPLI_UNAVAILABLE:
                navCtrl.setRoot(GenericMessagePage, { message: this.translateService.instant('GLOBAL.MESSAGES.ERROR.SERVER_APPLICATION_UNAVAILABLE') });
                break;
            case AuthenticationStatusEnum.AUTHENTICATION_KO:
                navCtrl.setRoot(AuthenticationPage);
                break;
            default:
                navCtrl.setRoot(GenericMessagePage, { message: this.translateService.instant('GLOBAL.MESSAGES.ERROR.APPLICATION_NOT_INITIALIZED') });
        }
    }
}
