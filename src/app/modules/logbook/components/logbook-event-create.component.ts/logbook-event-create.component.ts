import { Utils } from './../../../../shared/utils/utils';
import { LogbookSavedEvent } from './../../../../core/models/logbook/logbook-saved-event.model';
import { PncModel } from './../../../../core/models/pnc.model';
import { PncLightModel } from './../../../../core/models/pnc-light.model';
import { PncService } from './../../../../core/services/pnc/pnc.service';
import { DateTransform } from './../../../../shared/utils/date-transform';
import { ToastService } from './../../../../core/services/toast/toast.service';
import { SessionService } from './../../../../core/services/session/session.service';
import { LogbookEventCategory } from './../../../../core/models/logbook/logbook-event-category';
import { TranslateService } from '@ngx-translate/core';
import { SecurityService } from './../../../../core/services/security/security.service';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { LogbookEventModel } from '../../../../core/models/logbook/logbook-event.model';
import { OnlineLogbookEventService } from '../../../../core/services/logbook/online-logbook-event.service';
import * as _ from 'lodash';

@Component({
    selector: 'logbook-event-create',
    templateUrl: 'logbook-event-create.component.html'
})
export class LogbookEventCreateComponent  implements OnInit {

    logbookEventCategories: LogbookEventCategory[];

    @Input() logbookEvent: LogbookEventModel;

    @Output()
    logbookSavedEvent = new EventEmitter<LogbookSavedEvent>();

    originLogbookEvent: LogbookEventModel;
    pnc: PncModel;
    eventDateString: string;
    monthsNames;

    titleMaxLength = 100;

    loading: Loading;

    constructor(
        private securityService: SecurityService,
        private translateService: TranslateService,
        private sessionService: SessionService,
        public navParams: NavParams,
        private alertCtrl: AlertController,
        private toastService: ToastService,
        private loadingCtrl: LoadingController,
        private dateTransformer: DateTransform,
        private onlineLogbookEventService: OnlineLogbookEventService,
        private pncService: PncService) {
            this.logbookEvent = new LogbookEventModel();
            // Traduction des mois
            this.monthsNames = this.translateService.instant('GLOBAL.MONTH.LONGNAME');
            const matricule = this.navParams.get('matricule');
            this.logbookEvent.pnc = new PncLightModel();
            this.logbookEvent.pnc.matricule = matricule;
            const eventDate: Date = new Date();
            this.logbookEvent.eventDate = this.dateTransformer.transformDateToIso8601Format(eventDate);
            this.originLogbookEvent = _.cloneDeep(this.logbookEvent);
            this.eventDateString = this.dateTransformer.formatDateInDay(eventDate);

    }

    @Input() set groupId(groupId: number) {
        if (typeof groupId !== 'undefined' && groupId) {
            this.logbookEvent.groupId = groupId;
        }
    }

    @Input() set logbookEventToEdit(logbookEvent: LogbookEventModel) {
        this.logbookEvent = logbookEvent;
        this.originLogbookEvent = _.cloneDeep(this.logbookEvent);
    }

    ngOnInit() {
        this.initForm();
    }

    /**
     * Initialise la liste déroulante des catégories depuis les paramètres
     */
    initForm() {
        if (this.sessionService.getActiveUser().parameters !== undefined) {
            const params: Map<string, any> = this.sessionService.getActiveUser().parameters.params;
            this.logbookEventCategories = params['logbookEventCategories'];
        }
    }

    /**
     * Vérifie si le PNC est manager
     * @return vrai si le PNC est manager, faux sinon
     */
    isManager(): boolean {
        return this.securityService.isManager();
    }

    /**
     * Vérifie que les éléments obligatoires sont saisis pour l'enregistrement
     * @return true si l'évènement peut être enregistré
     */
    public canBeSaved(): boolean {
        return!( !this.logbookEvent
        || !this.logbookEvent.category  || !this.logbookEvent.eventDate
        || !this.logbookEvent.title || !this.logbookEvent.content );
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
                this.logbookSavedEvent.emit(new LogbookSavedEvent(savedLogbookEvent));
                this.toastService.success(this.translateService.instant('LOGBOOK.EDIT.LOGBOOK_SAVED'));
                this.loading.dismiss();
            }, error => {
                this.loading.dismiss();
              });

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
     * Vérifie si le formulaire a été modifié sans être enregistré
     * @return true si il n'y a pas eu de modifications
     */
    formHasBeenModified() {
        return this.logbookEvent.eventDate != this.originLogbookEvent.eventDate
        || Utils.getHashCode(this.originLogbookEvent) !== Utils.getHashCode(this.logbookEvent);
    }

    cancelEdition() {
        if (this.formHasBeenModified()) {
            return this.confirmAbandonChanges().then(() => {
                this.logbookEvent = _.cloneDeep(this.originLogbookEvent);
                return true;
            }
        ).catch(() => {
            return false;
        });
        } else {
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
            message: this.translateService.instant('LOGBOOK.EDIT.CONFIRM_CANCEL_MESSAGE'),
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
     * Confirme l'annulation des modifications
     */
    confirmCancel() {
        this.logbookSavedEvent.emit(new LogbookSavedEvent(null));
    }
}
