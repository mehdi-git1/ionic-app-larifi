import { SecurityProvider } from './../providers/security/security';
import { ToastProvider } from './../providers/toast/toast';
import { OfflineSecurityProvider } from './../providers/security/offline-security';
import { SessionService } from './session.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, ViewController, Modal } from 'ionic-angular';
import { Injectable, Output, EventEmitter } from '@angular/core';


import { AuthenticatedUser } from './../models/authenticatedUser';
import { PinPadModal } from './../components/modals/pin-pad-modal/pin-pad-modal';

import { PinPadType, PinPadTitle, SecretQuestionType, PinPadError, SecretQuestionError, GlobalError } from './../models/securitymodalType';
import { SecretQuestionModal } from '../components/modals/secret-question-modal/secret-question-modal';


@Injectable()
export class SecurityModalService {

    @Output() modalDisplayed = new EventEmitter<boolean>();
    pinModal: Modal;
    secretQuestionModal: Modal;
    modalType: PinPadType | SecretQuestionType;

    pinValue: string;
    errorType: PinPadError | SecretQuestionError | GlobalError;

    // Variable permettant de savoir d'ou l'on vient (principalement pour code pin oublié lors du nouveau code pin)
    comeFrom: PinPadType | SecretQuestionType;

    constructor(
        public modalController: ModalController,
        public translateService: TranslateService,
        public sessionService: SessionService,
        public securityProvider: SecurityProvider,
        public toastProvider: ToastProvider
    ) {
        this.errorType = GlobalError.none;
    }

    /**
     * fonction permettant d'afficher le pinPad selon différents cas
     * @param type => permet de définir le type d'affichage
     */
    displayPinPad(type){

        this.modalDisplayed.emit(true);

        this.modalType = type;
        const pinCode = this.sessionService.authenticatedUser.pinInfo.pinCode;
        // const pinCode = '1234';
        // Si pas de code Pin lors de l'ouverture de l'app => premiére connexion
        // On initialise donc le code pin
        if (!pinCode && type === PinPadType.openingApp){
            this.modalType = PinPadType.firstConnexionStage1;
        }

        this.pinModal = this.modalController.create(PinPadModal,
            {
                modalType : this.modalType,
                errorType : this.errorType
            }
        );
        this.pinModal.onDidDismiss(data => {
            this.modalDisplayed.emit(false);
            // Si premiére connexion => etape 2
            if (this.modalType === PinPadType.firstConnexionStage1){
                this.pinValue = data;
                this.displayPinPad(PinPadType.firstConnexionStage2);
            } else if (this.modalType === PinPadType.firstConnexionStage2){
                if (this.pinValue === data){
                    this.sessionService.authenticatedUser.pinInfo.pinCode = data;
                    // Si on vient de mot de passe oublié (donc de la réponse à la question)
                    if (this.comeFrom === SecretQuestionType.answerToQuestion){
                        const tmpAU = new AuthenticatedUser().fromJSON(this.sessionService.authenticatedUser);
                        this.securityProvider.setAuthenticatedSecurityValue(tmpAU);
                        this.toastProvider.success(this.translateService.instant('PIN_PAD.TOAST_MESSAGE.SUCCESS_REINIT'));
                    } else {
                        this.displaySecretQuestion(SecretQuestionType.newQuestion);
                    }
                }else{
                    this.errorType = PinPadError.pinInitIncorrect;
                    this.displayPinPad(PinPadType.firstConnexionStage1);
                }
            } else if (this.modalType === PinPadType.openingApp ){
                if (data === 'forgotten'){
                    this.displaySecretQuestion(SecretQuestionType.answerToQuestion);
                } else if (pinCode != data){
                    this.errorType = PinPadError.pinIncorrect;
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

        this.modalType = type;

        // Traduction du titre
        this.secretQuestionModal = this.modalController.create(SecretQuestionModal,
            {
                modalType : type,
                question: this.sessionService.authenticatedUser.pinInfo.secretQuestion,
                errorType : this.errorType
            });
        this.secretQuestionModal.onDidDismiss(data => {
            this.modalDisplayed.emit(false);
            if (this.modalType === SecretQuestionType.newQuestion){
                this.sessionService.authenticatedUser.pinInfo.matricule = this.sessionService.authenticatedUser.matricule;
                this.sessionService.authenticatedUser.pinInfo.secretQuestion = data.secretQuestion;
                this.sessionService.authenticatedUser.pinInfo.secretAnswer = data.secretAnswer;
                const tmpAU = new AuthenticatedUser().fromJSON(this.sessionService.authenticatedUser);
                this.securityProvider.setAuthenticatedSecurityValue(tmpAU);
                this.toastProvider.success(this.translateService.instant('SECRET_QUESTION.TOAST_MESSAGE.SUCCESS_INIT'));
            }

            if (this.modalType === SecretQuestionType.answerToQuestion){
                if (this.sessionService.authenticatedUser.pinInfo.secretAnswer === data.secretAnswer){
                    this.comeFrom = SecretQuestionType.answerToQuestion;
                    this.displayPinPad(PinPadType.firstConnexionStage1);
                }else{
                    this.errorType = SecretQuestionError.answerIncorrect;
                    this.displaySecretQuestion(SecretQuestionType.answerToQuestion);
                }
            }
        });
        this.secretQuestionModal.present();
    }
}
