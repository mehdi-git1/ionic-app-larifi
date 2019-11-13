import * as _ from 'lodash';
import * as moment from 'moment';

import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, Events } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AppConstant } from '../../../../app.constant';
import { EventCcoVisibilityEnum } from '../../../../core/enums/event-cco-visibility.enum';
import { LogbookEventModeEnum } from '../../../../core/enums/logbook-event/logbook-event-mode.enum';
import { LogbookEventTypeEnum } from '../../../../core/enums/logbook-event/logbook-event-type.enum';
import { TextEditorModeEnum } from '../../../../core/enums/text-editor-mode.enum';
import { LogbookEventModel } from '../../../../core/models/logbook/logbook-event.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    OnlineLogbookEventService
} from '../../../../core/services/logbook/online-logbook-event.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import {
    AbstractValueAccessor, MakeProvider
} from '../../../../shared/components/abstract-value-accessor';
import {
    PncAutoCompleteComponent
} from '../../../../shared/components/pnc-autocomplete/pnc-autocomplete.component';
import { DateTransform } from '../../../../shared/utils/date-transform';
import { DateUtils } from '../../../../shared/utils/date-utils';

@Component({
    selector: 'logbook-event-details',
    templateUrl: 'logbook-event-details.component.html',
    styleUrls: ['./logbook-event-details.component.scss'],
    providers: [MakeProvider(LogbookEventDetailsComponent)]
})
export class LogbookEventDetailsComponent extends AbstractValueAccessor implements OnInit {

    @Input() logbookEvent: LogbookEventModel;

    @Output() editionOrDeletion: EventEmitter<any> = new EventEmitter();

    editEvent = false;
    pnc: PncModel;
    eventDateString: string;

    originLogbookEvent: LogbookEventModel;

    LogbookEventTypeEnum = LogbookEventTypeEnum;
    TextEditorModeEnum = TextEditorModeEnum;
    EventCcoVisibilityEnum = EventCcoVisibilityEnum;

    visibilitySelected: EventCcoVisibilityEnum;

    visibilityForm: FormGroup;

    constructor(
        private alertCtrl: AlertController,
        private securityService: SecurityService,
        private translateService: TranslateService,
        private sessionService: SessionService,
        private dateTransformer: DateTransform,
        private datePipe: DatePipe,
        private events: Events,
        private formBuilder: FormBuilder,
        private onlineLogbookEventService: OnlineLogbookEventService,
        private toastService: ToastService) {
        super();
        this.events.subscribe('LinkedLogbookEvent:canceled', () => {
            this.editEvent = false;
        });

        this.events.subscribe('LogbookEvent:saved', () => {
            this.editEvent = false;
        });

        this.initForm();
    }

    ngOnInit() {
        if (this.sessionService.visitedPnc) {
            this.pnc = this.sessionService.visitedPnc;
        } else {
            this.pnc = this.sessionService.getActiveUser().authenticatedPnc;
        }
        this.initEventVisibility();
        this.originLogbookEvent = _.cloneDeep(this.logbookEvent);
        this.eventDateString = this.logbookEvent ? this.logbookEvent.eventDate : this.dateTransformer.transformDateToIso8601Format(new Date());
    }

    /**
     * Initialise le formulaire et la liste déroulante des catégories depuis les paramètres
     */
    initForm() {
        this.visibilityForm = this.formBuilder.group({
            visibilityControl: ['', Validators.required]
        });
    }

    /**
     * Initialise le groupe radio button avec la valeur de l'évènement.
     */
    initEventVisibility() {
        this.visibilitySelected = this.logbookEvent.hidden ? EventCcoVisibilityEnum.HIDDEN : this.logbookEvent.displayed ? EventCcoVisibilityEnum.DISPLAYED
            : this.getDisplayDate() ? EventCcoVisibilityEnum.WILL_BE_DISPLAYED_ON : EventCcoVisibilityEnum.DISPLAYED;
    }

    canDeactivate(): boolean {
        if (this.editEvent ) {
            return false;
        }
        return true;
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
     * Vérifie si le PNC connecté peut modifier l'évènement
     * @return vrai si l'évènement est CCO/ISCV et que le PNC est admin CCO/ISCV ou si l'évènement n'est pas CCO/ISCV
     * et que le PNC peut éditer l'évènement, faux sinon
     */
    canModifyEvent(): boolean {
        if (this.logbookEvent.type === LogbookEventTypeEnum.CCO || this.logbookEvent.type === LogbookEventTypeEnum.ISCV) {
            return this.securityService.isAdminCcoIscv(this.sessionService.getActiveUser());
        }
        return this.canEditEvent();
    }

    /**
     * Vérifie si le PNC connecté est le rédacteur de l'évènement, ou bien l'instructeur du pnc observé, ou bien son RDS
     * @return vrai si le PNC est redacteur, instructeur ou rds du pnc observé, faux sinon
     */
    canEditEvent(): boolean {
        const redactor = this.pnc && this.logbookEvent.redactor && this.sessionService.getActiveUser().matricule === this.logbookEvent.redactor.matricule;
        const instructor = this.pnc && this.pnc.pncInstructor && this.sessionService.getActiveUser().matricule === this.pnc.pncInstructor.matricule;
        const rds = this.pnc && this.pnc.pncRds && this.sessionService.getActiveUser().matricule === this.pnc.pncRds.matricule;
        const ccoIscvAdmin = this.pnc && this.securityService.isAdminCcoIscv(this.sessionService.getActiveUser());
        return redactor || instructor || rds || (ccoIscvAdmin && (this.logbookEvent.type === LogbookEventTypeEnum.CCO || this.logbookEvent.type === LogbookEventTypeEnum.ISCV));
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.logbookEvent !== undefined && this.logbookEvent !== null;
    }

    /**
     * Vérifie si le PNC est manager
     * @return vrai si le PNC est manager, faux sinon
     */
    isManager(): boolean {
        return this.securityService.isManager();
    }

    /**
     * Retourne la date de dernière modification, formatée pour l'affichage
     * @return la date de dernière modification au format dd/mm/
     */
    getLastUpdateDate(): string {
        return this.datePipe.transform(this.logbookEvent.lastUpdateDate, 'dd/MM/yyyy à HH:mm');
    }

    /**
     * Retourne la date d'affichage, formatée pour l'affichage
     * @return la date d'affichage' au format dd/mm/
     */
    getDisplayDate(): string {
        const now = moment();
        const broadcastDate = moment(this.logbookEvent.creationDate, AppConstant.isoDateFormat);
        const hiddenDuration = moment.duration(now.diff(broadcastDate)).asMilliseconds();
        const upToFifteenDays = moment.duration(15, 'days').asMilliseconds();
        if (hiddenDuration > upToFifteenDays) {
            return null;
        }
        return this.datePipe.transform(DateUtils.addDays(this.logbookEvent.creationDate, 15), 'dd/MM/yyyy à HH:mm');
    }

    /**
     * Verifie si l'évènement est caché
     */
    isHidden() {
        return this.getDisplayDate() && !this.logbookEvent.displayed || this.logbookEvent.hidden;
    }

    /**
     * Confirme le masquage/démasquage d'un évènement pour un PNC
     *
     * @param visibility masquer, afficher ou afficher dans 15 jours
     */
    confirmHideOrDisplayEvent(visibility: EventCcoVisibilityEnum) {
        if ((visibility === EventCcoVisibilityEnum.HIDDEN && !this.logbookEvent.hidden)
            || (visibility === EventCcoVisibilityEnum.DISPLAYED && !this.logbookEvent.displayed)
            || (visibility === EventCcoVisibilityEnum.WILL_BE_DISPLAYED_ON && (this.logbookEvent.displayed || this.logbookEvent.hidden))) {
            let title: string;
            let message: string;
            if (visibility === EventCcoVisibilityEnum.HIDDEN) {
                title = this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_HIDDEN_EVENT.TITLE');
                message = this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_HIDDEN_EVENT.MESSAGE');
            } else if (visibility === EventCcoVisibilityEnum.DISPLAYED) {
                title = this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_DISPLAYED_EVENT.TITLE');
                message = this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_DISPLAYED_EVENT.MESSAGE');
            } else {
                title = this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_DISPLAYED_EVENT_AFTER_FIFTEEN_DAYS.TITLE', { 'date': this.getDisplayDate() });
                message = this.translateService.instant('LOGBOOK.NOTIFICATION.CONFIRM_DISPLAYED_EVENT_AFTER_FIFTEEN_DAYS.MESSAGE', { 'date': this.getDisplayDate() });
            }
            return this.confirmationPopup(title, message).then(() => {
                this.visibilityChange(visibility);
            }).catch(() => {
                this.initEventVisibility();
            });
        }
    }


    /**
     * Masqué/démasqué un évènement
     * @param event masquer, afficher ou afficher dans 15 jours
     */
    visibilityChange(event: any) {
        let displayed = false;
        let hidden = false;
        if (event === EventCcoVisibilityEnum.HIDDEN) {
            hidden = true;
        } else if (event === EventCcoVisibilityEnum.DISPLAYED) {
            displayed = true;
        }
        if (displayed != this.logbookEvent.displayed || hidden != this.logbookEvent.hidden) {
            this.logbookEvent.displayed = displayed;
            this.logbookEvent.hidden = hidden;
            this.onlineLogbookEventService.hideOrDisplay(this.logbookEvent).then(savedLogbookEvent => {
                this.logbookEvent = savedLogbookEvent;
                if (this.logbookEvent.displayed) {
                    this.toastService.success(this.translateService.instant('LOGBOOK.VISIBILITY.EVENT_DISPLAYED'));
                } else if (this.logbookEvent.hidden) {
                    this.toastService.success(this.translateService.instant('LOGBOOK.VISIBILITY.EVENT_HIDDEN'));
                } else {
                    this.toastService.success(this.translateService.instant('LOGBOOK.VISIBILITY.WILL_BE_DISPLAYED_ON', { 'date': this.getDisplayDate() }));
                }
            });
        }
    }

    /**
     * Popup d'avertissement en cas de modifications non enregistrées.
     */
    confirmationPopup(title: string, message: string) {
        return new Promise((resolve, reject) => {
            // Avant de quitter la vue, on avertit l'utilisateur si ses modifications n'ont pas été enregistrées
            this.alertCtrl.create({
                header: title,
                message: message,
                buttons: [
                    {
                        text: this.translateService.instant('GLOBAL.BUTTONS.CANCEL'),
                        role: 'cancel',
                        handler: () => reject()
                    },
                    {
                        text: this.translateService.instant('GLOBAL.BUTTONS.YES'),
                        handler: () => resolve()
                    }
                ]
            }).then(alert => {
                alert.present();
            });
        });
    }


    /**
     * Affiche le message d'information de la dernière modification faite sur l'évènement
     */
    showInformationMessage() {
        return this.logbookEvent.lastUpdateAuthor && this.logbookEvent.lastUpdateDate !== this.logbookEvent.creationDate;
    }
}
