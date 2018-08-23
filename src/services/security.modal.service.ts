import { OfflineSecurityProvider } from './../providers/security/offline-security';
import { SessionService } from './session.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, ViewController, Modal } from 'ionic-angular';
import { Injectable, Output, EventEmitter } from '@angular/core';


import { AuthenticatedUser } from './../models/authenticatedUser';
import { PinPadModal } from './../components/modals/pin-pad-modal/pin-pad-modal';

import { PinPadType, PinPadTitle, SecretQuestionType} from './../models/securitymodalType';
import { SecretQuestionModal } from '../components/modals/secret-question-modal/secret-question-modal';


@Injectable()
export class SecurityModalService {

    @Output() modalDisplayed = new EventEmitter<boolean>();
    pinModal: Modal;
    secretQuestionModal: Modal;
    typeModal: PinPadType | SecretQuestionType;

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
     */
    displayPinPad(type){

        this.modalDisplayed.emit(true);

        this.typeModal = type;
        const pinCode = this.sessionService.authenticatedUser.pinCode;
        // const pinCode = '1234';
        // Si pas de code Pin lors de l'ouverture de l'app => premiére connexion
        // On initialise donc le code pin
        if (!pinCode && type === PinPadType.openingApp){
            this.typeModal = PinPadType.firstConnexionStage1;
        }

        this.pinModal = this.modalController.create(PinPadModal, {typeModal : this.typeModal});
        this.pinModal.onDidDismiss(data => {
            this.modalDisplayed.emit(false);
            // Si premiére connexion => etape 2
            if (this.typeModal === PinPadType.firstConnexionStage1){
                this.pinValue = data;
                this.displayPinPad(PinPadType.firstConnexionStage2);
            } else if (this.typeModal === PinPadType.firstConnexionStage2){
                if (this.pinValue === data){
                    this.sessionService.authenticatedUser.pinCode = data;
                    this.displaySecretQuestion(SecretQuestionType.newQuestion);
                }else{
                  this.displayPinPad(PinPadType.firstConnexionStage1);
                }
            } else if (this.typeModal === PinPadType.openingApp ){
                if (data === 'forgotten'){
                    this.displaySecretQuestion(SecretQuestionType.answerToQuestion);
                } else if (pinCode != data){
                    this.displayPinPad(PinPadType.openingApp);
                }
            }
        });
        this.pinModal.present();
    }

    /**
     * fonction permettant d'afficher le question / reponse selon différents cas
     * @param type => permet de définir le type d'affichage
     */
    displaySecretQuestion(type){
        this.modalDisplayed.emit(true);

        this.typeModal = type;

        // Traduction du titre
        this.secretQuestionModal = this.modalController.create(SecretQuestionModal,
            {typeModal : type, question: this.sessionService.authenticatedUser.secretQuestion});
        this.secretQuestionModal.onDidDismiss(data => {
            this.modalDisplayed.emit(false);
            if (this.typeModal === SecretQuestionType.newQuestion){
                this.sessionService.authenticatedUser.secretQuestion = data.secretQuestion;
                this.sessionService.authenticatedUser.secretAnswer = data.secretAnswer;
                const tmpAU = new AuthenticatedUser().fromJSON(this.sessionService.authenticatedUser);
                this.offlineSecurityProvider.overwriteAuthenticatedUser(tmpAU);
            }

            if (this.typeModal === SecretQuestionType.answerToQuestion){
                if (this.sessionService.authenticatedUser.secretAnswer === data.secretAnswer){
                    this.displayPinPad(PinPadType.firstConnexionStage1);
                }else{
                    this.displaySecretQuestion(SecretQuestionType.answerToQuestion);
                }
            }
        });
        this.secretQuestionModal.present();
    }
}
