import {
    AlertController, Events, Loading, LoadingController, NavController, NavParams
} from 'ionic-angular';
import * as _ from 'lodash';

import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { LogbookEventModeEnum } from '../../../../core/enums/logbook-event/logbook-event-mode.enum';
import { LogbookEventTypeEnum } from '../../../../core/enums/logbook-event/logbook-event-type.enum';
import { TextEditorModeEnum } from '../../../../core/enums/text-editor-mode.enum';
import { LogbookEventCategory } from '../../../../core/models/logbook/logbook-event-category';
import { LogbookEventModel } from '../../../../core/models/logbook/logbook-event.model';
import { PncLightModel } from '../../../../core/models/pnc-light.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    OnlineLogbookEventService
} from '../../../../core/services/logbook/online-logbook-event.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { DateTransform } from '../../../../shared/utils/date-transform';
import { Utils } from '../../../../shared/utils/utils';

@Component({
    selector: 'logbook-event',
    templateUrl: 'logbook-event.component.html'
})
export class LogbookEventComponent implements OnInit {

    @Input() logbookEvent: LogbookEventModel;

    @Input() mode: LogbookEventModeEnum;

    @Input() groupId: number;

    @Output() editionOrDeletion: EventEmitter<any> = new EventEmitter();

    editEvent = false;
    eventDateString: string;
    monthsNames;
    pnc: PncModel;
    techId: number;
    loading: Loading;

    logbookEventCategories: LogbookEventCategory[];
    originLogbookEvent: LogbookEventModel;

    titleMaxLength = 100;

    LogbookEventModeEnum = LogbookEventModeEnum;
    TextEditorModeEnum = TextEditorModeEnum;

    cancelFromButton = false;

    logbookEventForm: FormGroup;

    constructor(private navParams: NavParams,
        private securityService: SecurityService,
        private translateService: TranslateService,
        private sessionService: SessionService,
        private onlineLogbookEventService: OnlineLogbookEventService,
        private navCtrl: NavController,
        private toastService: ToastService,
        private loadingCtrl: LoadingController,
        private dateTransformer: DateTransform,
        private events: Events,
        private alertCtrl: AlertController,
        private pncService: PncService,
        private datePipe: DatePipe,
        private formBuilder: FormBuilder) {
        // Traduction des mois
        this.monthsNames = this.translateService.instant('GLOBAL.MONTH.LONGNAME');

    }

    ngOnInit() {
        if (this.sessionService.visitedPnc) {
            this.pnc = this.sessionService.visitedPnc;
        } else {
            this.pnc = this.sessionService.getActiveUser().authenticatedPnc;
        }
        if (this.mode === LogbookEventModeEnum.CREATION || this.mode === LogbookEventModeEnum.LINKED_EVENT_CREATION) {
            this.editEvent = true;
            this.logbookEvent = new LogbookEventModel();
            if (typeof this.groupId !== 'undefined') {
                this.logbookEvent.groupId = this.groupId;
            }
            this.logbookEvent.pnc = new PncLightModel();
            this.logbookEvent.pnc.matricule = this.pnc.matricule;
            this.logbookEvent.category = new LogbookEventCategory();
            const eventDate: Date = new Date();
            this.logbookEvent.eventDate = this.dateTransformer.transformDateToIso8601Format(eventDate);
            this.logbookEvent.mode = this.mode;
            this.logbookEvent.notifiedPncs = new Array();
            if (this.pnc.pncInstructor && this.pnc.pncInstructor.matricule !== this.sessionService.getActiveUser().matricule) {
                this.logbookEvent.notifiedPncs.push(this.pnc.pncInstructor);
            }
            this.initForm();
        }
        this.originLogbookEvent = _.cloneDeep(this.logbookEvent);
        this.eventDateString = this.logbookEvent ? this.logbookEvent.eventDate : this.dateTransformer.transformDateToIso8601Format(new Date());
    }

    /**
    * Initialise la liste déroulante des catégories depuis les paramètres
    */
    initForm() {
        if (this.sessionService.getActiveUser().appInitData !== undefined) {
            this.logbookEventCategories = this.sessionService.getActiveUser().appInitData.logbookEventCategories;
        }

        this.logbookEventForm = this.formBuilder.group({
            eventDate: ['', Validators.required],
            pncInitiator: false,
            important: false,
            category: ['', Validators.required],
            title: ['', [Validators.maxLength(100), Validators.required]],
            content: ['', [Validators.maxLength(4000), Validators.required]],
        });
    }

    /**
     *  Compare deux categories et renvois true si elles sont égales
     * @param category1 premiere categorie à comparér
     * @param category2 Deuxieme categorie à comparér
     */
    compareCategories(category1: LogbookEventCategory, category2: LogbookEventCategory): boolean {
        if (category1.id === category2.id) {
            return true;
        }
        return false;
    }

    /**
     * Envoie un event avec l'évènement à editer, à la page parente.
     */
    editLogbookEvent() {
        this.logbookEvent.mode = LogbookEventModeEnum.EDITION;
        this.originLogbookEvent = _.cloneDeep(this.logbookEvent);
        this.editionOrDeletion.emit(this.logbookEvent);
    }

    /**
     * Envoie un event avec l'évènement à supprimer, à la page parente.
     */
    deleteLogbookEvent() {
        this.logbookEvent.mode = LogbookEventModeEnum.DELETION;
        this.originLogbookEvent = _.cloneDeep(this.logbookEvent);
        this.editionOrDeletion.emit(this.logbookEvent);
    }

    /**
     * Annule la création / modification de l'évènement en appuyant sur le bouton annuler.
     */
    cancelLogbookEventCreationOrEdition() {
        this.cancelFromButton = true;
        this.confirmCancel();
    }

    /**
     * Confirme l'annulation des modifications
     */
    confirmCancel() {
        if (this.formHasBeenModified()) {
            const title = this.translateService.instant('GLOBAL.CONFIRM_BACK_WITHOUT_SAVE.TITLE');
            const message = this.mode == LogbookEventModeEnum.CREATION || this.mode == LogbookEventModeEnum.LINKED_EVENT_CREATION ? this.translateService.instant('LOGBOOK.EDIT.CONFIRM_CANCEL_CREATE_MESSAGE') : this.translateService.instant('LOGBOOK.EDIT.CONFIRM_CANCEL_UPDATE_MESSAGE');
            return this.confirmationPopoup(title, message).then(() => {
                this.logbookEvent = _.cloneDeep(this.originLogbookEvent);
                if (this.cancelFromButton && this.mode === LogbookEventModeEnum.CREATION) {
                    this.navCtrl.pop();
                    this.cancelFromButton = false;
                } else {
                    this.events.publish('LinkedLogbookEvent:canceled');
                }
                this.editEvent = false;
                return true;
            }
            ).catch(() => {
                this.cancelFromButton = false;
                return false;
            });
        } else {
            if (this.cancelFromButton && this.mode === LogbookEventModeEnum.CREATION) {
                this.navCtrl.pop();
                this.cancelFromButton = false;
            } else if (this.cancelFromButton) {
                this.editEvent = false;
            }
            this.events.publish('LinkedLogbookEvent:canceled');
            return true;
        }

    }


    /**
     * Popup d'avertissement en cas de modifications non enregistrées.
     */

    confirmationPopoup(title: string, message: string) {
        return new Promise((resolve, reject) => {
            // Avant de quitter la vue, on avertit l'utilisateur si ses modifications n'ont pas été enregistrées
            this.alertCtrl.create({
                title: title,
                message: message,
                buttons: [
                    {
                        text: this.translateService.instant('GLOBAL.BUTTONS.CANCEL'),
                        role: 'cancel',
                        handler: () => reject()
                    },
                    {
                        text: this.translateService.instant('GLOBAL.BUTTONS.CONFIRM'),
                        handler: () => resolve()
                    }
                ]
            }).present();
        });
    }


    /**
    * Vérifie si le formulaire a été modifié sans être enregistré
    * @return true si il n'y a pas eu de modifications
    */
    formHasBeenModified() {
        return this.logbookEvent.eventDate != this.originLogbookEvent.eventDate
            || Utils.getHashCode(this.originLogbookEvent) !== Utils.getHashCode(this.logbookEvent);
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.logbookEvent !== undefined && this.logbookEvent !== null;
    }

    /**
     * Enregistre l'évènement du journal de bord
     */
    saveLogbookEvent() {
        return new Promise((resolve, reject) => {
            const logbookEventToSave: LogbookEventModel = this.prepareLogbookEventBeforeSubmit(this.logbookEvent);
            this.loading = this.loadingCtrl.create();
            this.loading.present();

            this.onlineLogbookEventService.createOrUpdate(logbookEventToSave)
                .then(savedLogbookEvent => {
                    this.originLogbookEvent = _.cloneDeep(savedLogbookEvent);
                    this.logbookEvent = savedLogbookEvent;
                    this.events.publish('LogbookEvent:saved');
                    if (this.mode === LogbookEventModeEnum.CREATION || this.mode === LogbookEventModeEnum.LINKED_EVENT_CREATION) {
                        this.toastService.success(this.translateService.instant('LOGBOOK.EDIT.LOGBOOK_SAVED'));
                        if (this.mode === LogbookEventModeEnum.CREATION) {
                            this.navCtrl.pop();
                        }
                    } else {
                        this.toastService.success(this.translateService.instant('LOGBOOK.EDIT.LOGBOOK_UPDATED'));
                        this.editEvent = false;
                    }
                    this.loading.dismiss();
                }, error => {
                    this.loading.dismiss();
                });

        });
    }

    /**
     * Confirme la modification d'un évènement avec ou sans notification des personne concernés
     */
    confirmUpdateLogbookEvent() {
        if (this.logbookEvent.notifiedPncs && this.logbookEvent.notifiedPncs.length > 0) {
            return this.confirmationPopoup(this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_NOTIFICATION.TITLE'), this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_NOTIFICATION.MESSAGE')).then(() => {
                this.saveLogbookEvent();
            }).catch(() => { });
        } else if (this.logbookEvent.notifiedPncs && this.logbookEvent.notifiedPncs.length === 0) {
            this.confirmationPopoup(this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_EDIT_WITHOUT_NOTIFICATION.TITLE'), this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_EDIT_WITHOUT_NOTIFICATION.MESSAGE')).then(() => {
                this.saveLogbookEvent();
            }).catch(() => { });
        } else {
            this.saveLogbookEvent();
        }
    }

    /**
     * Confirme l'enregistrement d'un évènement sans notifier les personne concernés
     */
    confirmSaveLogbookEvent() {
        if (!this.logbookEvent.notifiedPncs || this.logbookEvent.notifiedPncs.length === 0) {
            this.confirmationPopoup(this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_CREATE_WITHOUT_NOTIFICATION.TITLE'), this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_CREATE_WITHOUT_NOTIFICATION.MESSAGE')).then(() => {
                this.saveLogbookEvent();
            }).catch(() => { });
        } else {
            this.saveLogbookEvent();
        }
    }

    /**
     * Prépare l'évènement du journal de bord avant de l'envoyer au back :
     * Transforme les dates au format iso
     * ou supprime l'entrée de l'objet si une ou plusieurs dates sont nulles
     *
     * @param logbookEventToSave l'évènement du journal de bord à enregistrer
     * @return l'évènement du journal de bord à enregistrer avec la date de rencontre transformée
     */
    prepareLogbookEventBeforeSubmit(logbookEventToSave: LogbookEventModel): LogbookEventModel {
        if (typeof this.logbookEvent.eventDate !== 'undefined' && this.logbookEvent.eventDate !== null) {
            logbookEventToSave.eventDate = this.dateTransformer.transformDateStringToIso8601Format(this.logbookEvent.eventDate);
        }
        return logbookEventToSave;
    }

    /**
     * Vérifie si le PNC est manager
     * @return vrai si le PNC est manager, faux sinon
     */
    isManager(): boolean {
        return this.securityService.isManager();
    }

    /**
     * Vérifie si le PNC connecté est le rédacteur de l'évènement, ou bien l'instructeur du pnc observé, ou bien son RDS
     * @return vrai si le PNC est redacteur, instructeur ou rds du pnc observé, faux sinon
     */
    canEditEvent(): boolean {
        const redactor = this.pnc && this.logbookEvent.redactor && this.sessionService.getActiveUser().matricule === this.logbookEvent.redactor.matricule;
        const instructor = this.pnc && this.pnc.pncInstructor && this.sessionService.getActiveUser().matricule === this.pnc.pncInstructor.matricule;
        const rds = this.pnc && this.pnc.pncRds && this.sessionService.getActiveUser().matricule === this.pnc.pncRds.matricule;
        const ccoAdmin = this.pnc && this.securityService.isCcoAdmin(this.sessionService.getActiveUser()) && this.securityService.isIscvAdmin(this.sessionService.getActiveUser());
        return redactor || instructor || rds || (ccoAdmin && (this.logbookEvent.type === LogbookEventTypeEnum.CCO || this.logbookEvent.type === LogbookEventTypeEnum.ISCV));
    }

    /**
     * Retourne la date de dernière modification, formatée pour l'affichage
     * @return la date de dernière modification au format dd/mm/
     */
    getLastUpdateDate(): string {
        return this.datePipe.transform(this.logbookEvent.lastUpdateDate, 'dd/MM/yyyy à HH:mm');
    }

    /**
     * Verifie si le pnc est notifié
     * @param pncLight le pnc concerné
     * @return true si le pnc est notifié, false sinon
     */
    isPncNotified(pncLight: PncLightModel): boolean {
        if (!pncLight || !pncLight.matricule || !this.logbookEvent.notifiedPncs) {
            return false;
        }
        let result: boolean;
        this.logbookEvent.notifiedPncs.forEach(pnc => {
            if (pnc.matricule === pncLight.matricule) {
                result = true;
            }
        });
        return result;
    }

    /**
     * Ajoute le pnc coché a la liste des pnc à notifier
     * @param myEvent l'event lié a la case à cocher
     * @param pncLight le pnc concerné
     */
    updatePncNotifiedList(myEvent: any, pncLight: PncLightModel) {
        if (myEvent.checked) {
            this.logbookEvent.notifiedPncs.push(pncLight);
        } else {
            this.logbookEvent.notifiedPncs = this.logbookEvent.notifiedPncs.filter(pnc =>
                pnc.matricule !== pncLight.matricule);
        }

    }
}
