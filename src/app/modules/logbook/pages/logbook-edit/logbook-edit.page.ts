import { ToastService } from './../../../../core/services/toast/toast.service';
import { PncService } from './../../../../core/services/pnc/pnc.service';
import { PncModel } from './../../../../core/models/pnc.model';
import { OnlineLogbookEventService } from './../../../../core/services/logbook/online-logbook-event.service';
import { DateTransform } from './../../../../shared/utils/date-transform';
import { Utils } from './../../../../shared/utils/utils';
import { TranslateService } from '@ngx-translate/core';
import { NavController, AlertController, LoadingController, Loading, NavParams } from 'ionic-angular';
import { SessionService } from './../../../../core/services/session/session.service';
import { LogbookEventModel } from './../../../../core/models/logbook/logbook-event.model';
import { Component, Input, OnInit } from '@angular/core';
import { LogbookEventCategory } from '../../../../core/models/logbook/logbook-event-category';
import * as _ from 'lodash';
import { PncLightModel } from '../../../../core/models/pnc-light.model';

@Component({
    selector: 'logbook-edit',
    templateUrl: 'logbook-edit.page.html',
})
export class LogbookEditPage implements OnInit  {

    logbookEventCategories: LogbookEventCategory[];

    originLogbookEvent: LogbookEventModel;
    logbookEvent: LogbookEventModel;
    loading: Loading;
    pnc: PncModel;
    eventDateString: string;
    monthsNames;

    constructor(private sessionService: SessionService,
        private navCtrl: NavController,
        public navParams: NavParams,
        private translateService: TranslateService,
        private alertCtrl: AlertController,
        private toastService: ToastService,
        private loadingCtrl: LoadingController,
        private dateTransformer: DateTransform,
        private onlineLogbookEventService: OnlineLogbookEventService,
        private pncService: PncService) {
        // Traduction des mois
        this.monthsNames = this.translateService.instant('GLOBAL.MONTH.LONGNAME');
        const matricule = this.navParams.get('matricule');
        this.pncService.getPnc(matricule).then(pnc => {
            this.pnc = pnc;
            this.logbookEvent = new LogbookEventModel();
            this.logbookEvent.pnc = new PncLightModel();
            this.logbookEvent.pnc.matricule = this.pnc.matricule;
            const eventDate: Date = new Date();
            this.logbookEvent.eventDate = this.dateTransformer.transformDateToIso8601Format(eventDate);
            this.originLogbookEvent = _.cloneDeep(this.logbookEvent);
            this.eventDateString = this.dateTransformer.formatDateInDay(eventDate);
            }, error => { });
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
     * Vérifie que les éléments obligatoires sont saisis pour l'enregistrement
     * @return true si l'évènement peut être enregistré
     */
    public canBeSaved(): boolean {
        return!( !this.logbookEvent
        || !this.logbookEvent.category  || !this.logbookEvent.eventDate
        || !this.logbookEvent.title || !this.logbookEvent.content );
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
                this.toastService.success(this.translateService.instant('LOGBOOK.EDIT.LOGBOOK_SAVED'));
                this.navCtrl.pop();
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

    ionViewCanLeave() {
        if (this.formHasBeenModified()) {
          return this.confirmAbandonChanges().then(() => {
            this.logbookEvent = _.cloneDeep(this.originLogbookEvent);
          }
          );
        } else {
          return true;
        }
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
        this.navCtrl.pop();
    }

}
