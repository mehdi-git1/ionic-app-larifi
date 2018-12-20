import { GlobalErrorEnum } from '../../enums/global-error.enum';
import { PinPadErrorEnum } from '../../enums/security/pin-pad-error.enum';
import { PinPadTypeEnum } from '../../enums/security/pin-pad-type.enum';
import { SecretQuestionTypeEnum } from '../../enums/security/secret-question-type.enum';
import { SecurityService } from '../security/security.service';
import { ToastService } from '../toast/toast.service';
import { SessionService } from '../session/session.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, Modal } from 'ionic-angular';
import { Injectable, Output, EventEmitter } from '@angular/core';


import { AuthenticatedUserModel } from '../../models/authenticated-user.model';
import { PinPadModalComponent } from '../../../shared/components/modals/pin-pad-modal/pin-pad-modal.component';

import { SecretQuestionModalComponent } from '../../../shared/components/modals/secret-question-modal/secret-question-modal.component';
import { SecretQuestionErrorEnum } from '../../enums/security/secret-question-error.enum';


@Injectable()
export class ModalSecurityService {

    @Output() modalDisplayed = new EventEmitter<boolean>();
    SecurityModal: Modal;
    modalType: PinPadTypeEnum | SecretQuestionTypeEnum;

    pinValue: string;
    errorType: PinPadErrorEnum | SecretQuestionErrorEnum | GlobalErrorEnum;

    // Variable permettant de savoir d'ou l'on vient (principalement pour code pin oublié lors du nouveau code pin)
    comeFrom: PinPadTypeEnum | SecretQuestionTypeEnum | null;

    constructor(
        private modalController: ModalController,
        private translateService: TranslateService,
        private sessionService: SessionService,
        private securityProvider: SecurityService,
        private toastProvider: ToastService
    ) {
        this.errorType = GlobalErrorEnum.none;
    }

    /**
     * Fonction permettant de fermer simplement un modal sans condition
     */
    forceCloseModal() {
        if (this.SecurityModal) {
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
        if (!pinCode && type === PinPadTypeEnum.openingApp) {
            this.modalType = PinPadTypeEnum.firstConnexionStage1;
        }

        this.SecurityModal = this.modalController.create(PinPadModalComponent,
            {
                modalType: this.modalType,
                errorType: this.errorType
            }
        );
        // Reinitialisation de l'erreur pour éviter qu'elle ne s'affiche partout
        this.errorType = GlobalErrorEnum.none;

        this.manageDismissPinPad();
        this.SecurityModal.present();
    }

    /**
     * Fonction permettant de gérer les données reçues du modal de pin
     */
    manageDismissPinPad() {
        const pinCode = this.sessionService.authenticatedUser.pinInfo.pinCode;
        this.SecurityModal.onDidDismiss(data => {
            // Si on a tué la modal, on dismiss juste car il y'a une autre modal qui va s'afficher derriére
            if (data === 'killModal') {
                return false;
            }

            this.modalDisplayed.emit(false);
            // Si on a annulé l'action, on dismiss juste mais on affiche l'arriére plan
            if (data === 'cancel') {
                return false;
            }

            // Si premiére connexion => etape 2
            if (this.modalType === PinPadTypeEnum.firstConnexionStage1) {
                this.pinValue = data;
                this.displayPinPad(PinPadTypeEnum.firstConnexionStage2);
            } else if (this.modalType === PinPadTypeEnum.firstConnexionStage2) {
                if (this.pinValue === data) {
                    this.sessionService.authenticatedUser.pinInfo.pinCode = data;
                    // Si on vient de mot de passe oublié (donc de la réponse à la question)
                    // Ou si l'on vient du changement de mot de passe
                    if (this.comeFrom === SecretQuestionTypeEnum.answerToQuestion || this.comeFrom === PinPadTypeEnum.askChange) {
                        this.securityProvider.setAuthenticatedSecurityValue(new AuthenticatedUserModel().fromJSON(this.sessionService.authenticatedUser));
                        this.toastProvider.success(this.translateService.instant('PIN_PAD.TOAST_MESSAGE.SUCCESS_REINIT'));
                    } else {
                        // Dans le cas contraire on et sur l'init et on doit répondre aux questions
                        this.displaySecretQuestion(SecretQuestionTypeEnum.newQuestion);
                    }
                } else {
                    this.errorType = PinPadErrorEnum.pinInitIncorrect;
                    this.displayPinPad(PinPadTypeEnum.firstConnexionStage1);
                }
            } else if (this.modalType === PinPadTypeEnum.openingApp) {
                if (data === 'forgotten') {
                    this.displaySecretQuestion(SecretQuestionTypeEnum.answerToQuestion);
                } else if (pinCode != data) {
                    this.errorType = PinPadErrorEnum.pinIncorrect;
                    this.displayPinPad(PinPadTypeEnum.openingApp);
                }
            } else if (this.modalType === PinPadTypeEnum.askChange) {
                if (pinCode != data) {
                    this.errorType = PinPadErrorEnum.pinIncorrect;
                    this.displayPinPad(PinPadTypeEnum.askChange);
                } else if (this.comeFrom === SecretQuestionTypeEnum.askChange) {
                    // Si on vient d'une demande de changement de question réponse on change la question réponse
                    this.displaySecretQuestion(SecretQuestionTypeEnum.newQuestion);
                } else {
                    this.comeFrom = PinPadTypeEnum.askChange;
                    this.displayPinPad(PinPadTypeEnum.firstConnexionStage1);
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
        if (type === SecretQuestionTypeEnum.askChange) {
            this.comeFrom = SecretQuestionTypeEnum.askChange;
            // On appelle le askchange qui demande l'ancien code pin
            this.displayPinPad(PinPadTypeEnum.askChange);
            return false;
        } else {
            this.SecurityModal = this.modalController.create(SecretQuestionModalComponent,
                {
                    modalType: type,
                    question: this.sessionService.authenticatedUser.pinInfo.secretQuestion,
                    errorType: this.errorType
                });
        }
        // Reinitialisation de l'erreur pour éviter qu'elle ne s'affiche partout
        this.errorType = GlobalErrorEnum.none;
        this.manageDismissSecretQuestion();
        this.SecurityModal.present();
    }

    /**
     * Fonction permettant de gérer les données reçues du modal de question réponse
     */
    manageDismissSecretQuestion() {
        this.SecurityModal.onDidDismiss(data => {
            // Si on a tué la modal, on dismiss juste car il y'a une aurre modal qui va s'afficher derriére
            if (data === 'killModal') {
                return false;
            }

            this.modalDisplayed.emit(false);
            // Si on a annulé l'action, on dismiss juste mais on affiche l'arriére plan
            if (data === 'cancel') {
                return false;
            }

            if (this.modalType === SecretQuestionTypeEnum.newQuestion) {
                // Reprise et enregistrements des valeurs dans la session et côté back
                this.sessionService.authenticatedUser.pinInfo.matricule = this.sessionService.authenticatedUser.matricule;
                this.sessionService.authenticatedUser.pinInfo.secretQuestion = data.secretQuestion;
                this.sessionService.authenticatedUser.pinInfo.secretAnswer = data.secretAnswer;
                this.securityProvider.setAuthenticatedSecurityValue(new AuthenticatedUserModel().fromJSON(this.sessionService.authenticatedUser));
                // On affiche le bon message en fonction de si on vient de l'init on du changement de question
                if (this.comeFrom === SecretQuestionTypeEnum.askChange) {
                    this.comeFrom = null;
                    this.toastProvider.success(this.translateService.instant('SECRET_QUESTION.TOAST_MESSAGE.SUCCESS_REINIT'));
                } else {
                    this.toastProvider.success(this.translateService.instant('SECRET_QUESTION.TOAST_MESSAGE.SUCCESS_INIT'));
                }
            }

            if (this.modalType === SecretQuestionTypeEnum.answerToQuestion) {
                if (this.sessionService.authenticatedUser.pinInfo.secretAnswer === data.secretAnswer) {
                    this.comeFrom = SecretQuestionTypeEnum.answerToQuestion;
                    this.displayPinPad(PinPadTypeEnum.firstConnexionStage1);
                } else {
                    this.errorType = SecretQuestionErrorEnum.answerIncorrect;
                    this.displaySecretQuestion(SecretQuestionTypeEnum.answerToQuestion);
                }
            }
        });
    }
}
