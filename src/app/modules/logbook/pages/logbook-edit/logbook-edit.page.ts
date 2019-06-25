import { LogbookEventDetailsComponent } from './../../components/logbook-event-details/logbook-event-details.component';
import { LogbookEventModeEnum } from './../../../../core/enums/logbook-event/logbook-event-mode.enum';
import { ToastService } from './../../../../core/services/toast/toast.service';
import { PncService } from './../../../../core/services/pnc/pnc.service';
import { PncModel } from './../../../../core/models/pnc.model';
import { OnlineLogbookEventService } from './../../../../core/services/logbook/online-logbook-event.service';
import { DateTransform } from './../../../../shared/utils/date-transform';
import { Utils } from './../../../../shared/utils/utils';
import { TranslateService } from '@ngx-translate/core';
import { NavController, AlertController, LoadingController, Loading, NavParams, Events } from 'ionic-angular';
import { SessionService } from './../../../../core/services/session/session.service';
import { LogbookEventModel } from './../../../../core/models/logbook/logbook-event.model';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LogbookEventCategory } from '../../../../core/models/logbook/logbook-event-category';
import * as _ from 'lodash';
import { PncLightModel } from '../../../../core/models/pnc-light.model';

@Component({
    selector: 'logbook-edit',
    templateUrl: 'logbook-edit.page.html',
})
export class LogbookEditPage {

    logbookEvent: LogbookEventModel;
    originLogbookEvent: LogbookEventModel;

    LogbookEventModeEnum = LogbookEventModeEnum;

    logbookEventSaved = false;
    logbookEventCanceled = false;

    @ViewChild('logbookEventCreate') logbookEventCreate: LogbookEventDetailsComponent;

    constructor(private sessionService: SessionService,
        private navCtrl: NavController,
        public navParams: NavParams,
        private translateService: TranslateService,
        private alertCtrl: AlertController,
        private toastService: ToastService,
        private loadingCtrl: LoadingController,
        private dateTransformer: DateTransform,
        private onlineLogbookEventService: OnlineLogbookEventService,
        private pncService: PncService,
        private events: Events) {
        this.events.subscribe('LinkedLogbookEvent:saved', () => {
            this.logbookEventSaved = true;
        });
        this.events.subscribe('LinkedLogbookEvent:canceled', () => {
            this.logbookEventCanceled = true;
        });
    }

    ionViewCanLeave() {
        if (this.logbookEventSaved || this.logbookEventCanceled) {
            return true;
        }
        return this.logbookEventCreate.confirmCancel();
    }

    /**
     * Popup d'avertissement en cas de modifications non enregistrées.
     */
    confirmAbandonChanges() {
        return new Promise((resolve, reject) => {
            // Avant de quitter la vue, on avertit l'utilisateur si ses modifications n'ont pas été enregistrées
            this.alertCtrl.create({
                title: this.translateService.instant('GLOBAL.CONFIRM_BACK_WITHOUT_SAVE.TITLE'),
                message: this.translateService.instant('LOGBOOK.EDIT.CONFIRM_CANCEL_CREATE_MESSAGE'),
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
        return true;
    }

}
