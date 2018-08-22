import { OfflineSecurityProvider } from './../providers/security/offline-security';
import { SessionService } from './session.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, ViewController, Modal } from 'ionic-angular';
import { Injectable, Output, EventEmitter } from '@angular/core';

import { PinPadType, PinPadTitle } from './../models/pinPadType';
import { AuthenticatedUser } from './../models/authenticatedUser';
import { PinPadModal } from './../components/modals/pin-pad-modal/pin-pad-modal';


@Injectable()
export class PinPadService {

    @Output() modalDisplayed = new EventEmitter<boolean>();
    pinModal: Modal;
    typeModal: PinPadType;

    pinValue: string;

    constructor(
        public modalController: ModalController,
        public translateService: TranslateService,
        public sessionService: SessionService,
        public offlineSecurityProvider: OfflineSecurityProvider
    ) {

    }

    /**
     * fonction permettant d'afficher le pinPad selon différents cas
     * @param type => permet de définir le type d'affichage
     * @param pinCode => contient le codePin pour test
     */
    display(type, pinCode){
        console.log('pinCcode', pinCode);
        this.modalDisplayed.emit(true);

        this.typeModal = type;
        // Si pas de code Pin = premiére connexion
        if (!pinCode){
            this.typeModal = PinPadType.firstConnexionStage1;
        }

        // Traduction du titre
        const titleTrad = this.translateService.instant(PinPadTitle[this.typeModal]) ;

        this.pinModal = this.modalController.create(PinPadModal, {titleModal : titleTrad});
        this.pinModal.onDidDismiss(data => {
            this.modalDisplayed.emit(false);
            // Si premiére connexion => etape 2
            if (this.typeModal === PinPadType.firstConnexionStage1){
                this.pinValue = data;
                this.display(PinPadType.firstConnexionStage2, this.pinValue);
            } else if (this.typeModal === PinPadType.firstConnexionStage2){
                if (this.pinValue === data){
                    this.sessionService.authenticatedUser.pinCode = data;
                    const tmpAU = new AuthenticatedUser().fromJSON(this.sessionService.authenticatedUser);
                    this.offlineSecurityProvider.overwriteAuthenticatedUser(tmpAU);
                }else{
                  this.display(PinPadType.firstConnexionStage1, this.pinValue);
                }
            }
        });
        this.pinModal.present();
    }
}
