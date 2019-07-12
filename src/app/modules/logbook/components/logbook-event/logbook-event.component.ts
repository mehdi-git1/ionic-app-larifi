import { DatePipe } from '@angular/common';
import { PncLightModel } from './../../../../core/models/pnc-light.model';
import { PncModel } from './../../../../core/models/pnc.model';
import { PncService } from './../../../../core/services/pnc/pnc.service';
import { Utils } from './../../../../shared/utils/utils';
import { LogbookEventModeEnum } from './../../../../core/enums/logbook-event/logbook-event-mode.enum';
import { DateTransform } from './../../../../shared/utils/date-transform';
import { ToastService } from './../../../../core/services/toast/toast.service';
import { SessionService } from './../../../../core/services/session/session.service';
import { LogbookEventCategory } from './../../../../core/models/logbook/logbook-event-category';
import { TranslateService } from '@ngx-translate/core';
import { SecurityService } from './../../../../core/services/security/security.service';
import { NavController, Loading, LoadingController, Events, AlertController, NavParams } from 'ionic-angular';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { LogbookEventModel } from '../../../../core/models/logbook/logbook-event.model';
import { OnlineLogbookEventService } from '../../../../core/services/logbook/online-logbook-event.service';
import * as _ from 'lodash';

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

    cancelFromButton = false;

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
        private datePipe: DatePipe) {
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
        }
        this.originLogbookEvent = _.cloneDeep(this.logbookEvent);
        this.eventDateString = this.logbookEvent ? this.logbookEvent.eventDate : this.dateTransformer.transformDateToIso8601Format(new Date());
        this.initForm();
    }

    /**
    * Initialise la liste déroulante des catégories depuis les paramètres
    */
    initForm() {
        if (this.sessionService.getActiveUser().appInitData !== undefined) {
            this.logbookEventCategories = this.sessionService.getActiveUser().appInitData.logbookEventCategories;
        }
    }

    /**
     *  Compare deux categories et renvois true si elles sont égales
     * @param e1 premiere categorie à comparér
     * @param e2 Deuxieme categorie à comparér
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
            return this.confirmAbandonChanges().then(() => {
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
    confirmAbandonChanges() {
        return new Promise((resolve, reject) => {
            // Avant de quitter la vue, on avertit l'utilisateur si ses modifications n'ont pas été enregistrées
            this.alertCtrl.create({
                title: this.translateService.instant('GLOBAL.CONFIRM_BACK_WITHOUT_SAVE.TITLE'),
                message: this.mode == LogbookEventModeEnum.CREATION || this.mode == LogbookEventModeEnum.LINKED_EVENT_CREATION ? this.translateService.instant('LOGBOOK.EDIT.CONFIRM_CANCEL_CREATE_MESSAGE') : this.translateService.instant('LOGBOOK.EDIT.CONFIRM_CANCEL_UPDATE_MESSAGE'),
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
        if (this.logbookEvent.notifiedPncs) {
            this.confirmNotifyPncs().then(() => {
                this.saveLogbookEvent();
            });
        } else {
            this.saveLogbookEvent();
        }
    }

    /**
     * Confirme l'enregistrement d'un évènement sans notifier les personne concernés
     */
    confirmSaveLogbookEvent() {
        if (!this.logbookEvent.notifiedPncs || this.logbookEvent.notifiedPncs.length === 0) {
            this.confirmWithoutNotification().then(() => {
                this.saveLogbookEvent();
            }).catch(() => { });
        } else {
            this.saveLogbookEvent();
        }
    }

    /**
     * Popup de demande de notification en cas de modification d'un évènement.
     */
    confirmNotifyPncs() {
        return new Promise((resolve, reject) => {
            this.alertCtrl.create({
                title: this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_NOTIFICATION.TITLE'),
                message: this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_NOTIFICATION.MESSAGE'),
                buttons: [
                    {
                        text: this.translateService.instant('GLOBAL.BUTTONS.NO'),
                        handler: () => {
                            this.logbookEvent.sendNotification = false;
                            resolve();
                        }
                    },
                    {
                        text: this.translateService.instant('GLOBAL.BUTTONS.YES'),
                        handler: () => {
                            this.logbookEvent.sendNotification = true;
                            resolve();
                        }
                    }
                ]
            }).present();
        });
    }

    /**
     * Popup de demande de confirmation sans envoi de notification
     */
    confirmWithoutNotification() {
        return new Promise((resolve, reject) => {
            this.alertCtrl.create({
                title: this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_WITHOUT_NOTIFICATION.TITLE'),
                message: this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_WITHOUT_NOTIFICATION.MESSAGE'),
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
     * Vérifie que les éléments obligatoires sont saisis pour l'enregistrement
     * @return true si l'évènement peut être enregistré
     */
    public canBeSaved(): boolean {
        return !(!this.logbookEvent
            || !this.logbookEvent.category.id || !this.logbookEvent.eventDate
            || !this.logbookEvent.title || !this.logbookEvent.content);
    }

    /**
     * Vérifie que les éléments obligatoires sont rempli et qu'une modification est faite.
     * @return true si l'évènement peut être enregistré
     */
    public canBeUpdated(): boolean {
        return this.canBeSaved() && this.formHasBeenModified();
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
        return redactor || instructor || rds;
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
