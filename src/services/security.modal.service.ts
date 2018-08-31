import { GlobalError } from './../models/globalError';
import { PinPadError } from './../models/pinPadError';
import { PinPadType } from './../models/pinPadType';
import { SecretQuestionType } from './../models/secretQuestionType';
import { SecurityProvider } from './../providers/security/security';
import { ToastProvider } from './../providers/toast/toast';
import { OfflineSecurityProvider } from './../providers/security/offline-security';
import { SessionService } from './session.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, ViewController, Modal } from 'ionic-angular';
import { Injectable, Output, EventEmitter } from '@angular/core';


import { AuthenticatedUser } from './../models/authenticatedUser';
import { PinPadModal } from './../components/modals/pin-pad-modal/pin-pad-modal';

import { SecretQuestionModal } from '../components/modals/secret-question-modal/secret-question-modal';
import { SecretQuestionError } from '../models/secretQuestionError';


@Injectable()
export class SecurityModalService {

    @Output() modalDisplayed = new EventEmitter<boolean>();
    SecurityModal: Modal;
    modalType: PinPadType | SecretQuestionType;

    pinValue: string;
    errorType: PinPadError | SecretQuestionError | GlobalError;

    // Variable permettant de savoir d'ou l'on vient (principalement pour code pin oublié lors du nouveau code pin)
    comeFrom: PinPadType | SecretQuestionType | null;

    constructor(
        private modalController: ModalController,
        private translateService: TranslateService,
        private sessionService: SessionService,
        private securityProvider: SecurityProvider,
        private toastProvider: ToastProvider
    ) {
        this.errorType = GlobalError.none;
    }

    /**
     * Fonction permettant de fermer simplement un modal sans condition
     */
    forceCloseModal(){
        if (this.SecurityModal){
            this.SecurityModal.dismiss('killModal');
        }
    }

    /**
     * fonction permettant d'afficher le pinPad selon différents cas
     * @param type permet de définir le type d'affichage
     */
    displayPinPad(type) {

        this.modalDisplayed.emit(true);


        this.modalType = type;

        const pinCode = this.sessionService.authenticatedUser.pinInfo.pinCode;

        // Si pas de code Pin lors de l'ouverture de l'app => premiére connexion
        // On initialise donc le code pin
        if (!pinCode && type === PinPadType.openingApp) {
            this.modalType = PinPadType.firstConnexionStage1;
        }

        this.SecurityModal = this.modalController.create(PinPadModal,
            {
                modalType: this.modalType,
                errorType: this.errorType
            }
        );
        // Reinitialisation de l'erreur pour éviter qu'elle ne s'affiche partout
        this.errorType = GlobalError.none;

        this.manageDismissPinPad();
        this.SecurityModal.present();
    }

    /**
     * Fonction permettant de gérer les données reçues du modal de pin
     */
    manageDismissPinPad() {
        const pinCode = this.sessionService.authenticatedUser.pinInfo.pinCode;
        this.SecurityModal.onDidDismiss(data => {
            // Si on a tué la modal, on dismiss juste car il y'a une aurre modal qui va s'afficher derriére
            if (data === 'killModal'){
                return false;
            }

            this.modalDisplayed.emit(false);
            // Si on a annulé l'action, on dismiss juste mais on affiche l'arriére plan
            if (data === 'cancel'){
                return false;
            }

            // Si premiére connexion => etape 2
            if (this.modalType === PinPadType.firstConnexionStage1) {
                this.pinValue = data;
                this.displayPinPad(PinPadType.firstConnexionStage2);
            } else if (this.modalType === PinPadType.firstConnexionStage2) {
                if (this.pinValue === data) {
                    this.sessionService.authenticatedUser.pinInfo.pinCode = data;
                    // Si on vient de mot de passe oublié (donc de la réponse à la question)
                    // Ou si l'on vient du changement de mot de passe
                    if (this.comeFrom === SecretQuestionType.answerToQuestion || this.comeFrom === PinPadType.askChange){
                        this.securityProvider.setAuthenticatedSecurityValue(new AuthenticatedUser().fromJSON(this.sessionService.authenticatedUser));
                        this.toastProvider.success(this.translateService.instant('PIN_PAD.TOAST_MESSAGE.SUCCESS_REINIT'));
                    } else {
                    // Dans le cas contraire on et sur l'init et on doit répondre aux questions
                        this.displaySecretQuestion(SecretQuestionType.newQuestion);
                    }
                } else {
                    this.errorType = PinPadError.pinInitIncorrect;
                    this.displayPinPad(PinPadType.firstConnexionStage1);
                }
            } else if (this.modalType === PinPadType.openingApp) {
                if (data === 'forgotten') {
                    this.displaySecretQuestion(SecretQuestionType.answerToQuestion);
                } else if (pinCode != data) {
                    this.errorType = PinPadError.pinIncorrect;
                    this.displayPinPad(PinPadType.openingApp);
                }
            } else if (this.modalType === PinPadType.askChange){
                if (pinCode != data){
                    this.errorType = PinPadError.pinIncorrect;
                    this.displayPinPad(PinPadType.askChange);
                } else {
                    // Si on vient d'une demande de changement de question réponse on change la question réponse
                    if (this.comeFrom === SecretQuestionType.askChange){
                        this.displaySecretQuestion(SecretQuestionType.newQuestion);
                    } else {
                        this.comeFrom = PinPadType.askChange;
                        this.displayPinPad(PinPadType.firstConnexionStage1);
                    }
                }
            }
        });
    }

    /**
     * fonction permettant d'afficher le question / reponse selon différents cas
     * @param type permet de définir le type d'affichage
     */
    displaySecretQuestion(type) {
        this.modalDisplayed.emit(true);

        this.modalType = type;

        // Si on vient pour changer la question, il faut d'abord demander le code pin actuel
        if (type === SecretQuestionType.askChange){
            this.comeFrom = SecretQuestionType.askChange;
            // On appelle le askchange qui demande l'ancien code pin
            this.displayPinPad(PinPadType.askChange);
            return false;
        } else {
            this.SecurityModal = this.modalController.create(SecretQuestionModal,
            {
                modalType: type,
                question: this.sessionService.authenticatedUser.pinInfo.secretQuestion,
                errorType: this.errorType
            });
        }
        // Reinitialisation de l'erreur pour éviter qu'elle ne s'affiche partout
        this.errorType = GlobalError.none;
        this.manageDismissSecretQuestion();
        this.SecurityModal.present();
    }

    /**
     * Fonction permettant de gérer les données reçues du modal de question réponse
     */
    manageDismissSecretQuestion() {
        this.SecurityModal.onDidDismiss(data => {
            // Si on a tué la modal, on dismiss juste car il y'a une aurre modal qui va s'afficher derriére
            if (data === 'killModal'){
                return false;
            }

            this.modalDisplayed.emit(false);
            // Si on a annulé l'action, on dismiss juste mais on affiche l'arriére plan
            if (data === 'cancel'){
                return false;
            }

            if (this.modalType === SecretQuestionType.newQuestion) {
                // Reprise et enregistrements des valeurs dans la session et côté back
                this.sessionService.authenticatedUser.pinInfo.matricule = this.sessionService.authenticatedUser.matricule;
                this.sessionService.authenticatedUser.pinInfo.secretQuestion = data.secretQuestion;
                this.sessionService.authenticatedUser.pinInfo.secretAnswer = data.secretAnswer;
                this.securityProvider.setAuthenticatedSecurityValue(new AuthenticatedUser().fromJSON(this.sessionService.authenticatedUser));
                // On affiche le bon message en fonction de si on vient de l'init on du changement de question
                if (this.comeFrom === SecretQuestionType.askChange){
                    this.comeFrom = null;
                    this.toastProvider.success(this.translateService.instant('SECRET_QUESTION.TOAST_MESSAGE.SUCCESS_REINIT'));
                } else {
                    this.toastProvider.success(this.translateService.instant('SECRET_QUESTION.TOAST_MESSAGE.SUCCESS_INIT'));
                }
            }

            if (this.modalType === SecretQuestionType.answerToQuestion) {
                if (this.sessionService.authenticatedUser.pinInfo.secretAnswer === data.secretAnswer) {
                    this.comeFrom = SecretQuestionType.answerToQuestion;
                    this.displayPinPad(PinPadType.firstConnexionStage1);
                } else {
                    this.errorType = SecretQuestionError.answerIncorrect;
                    this.displaySecretQuestion(SecretQuestionType.answerToQuestion);
                }
            }
        });
    }
}
