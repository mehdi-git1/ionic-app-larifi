import { LogbookEventComponent } from './../../components/logbook-event/logbook-event.component';
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
import { Component, Input, OnInit, ViewChild, ElementRef, ViewChildren, AfterViewInit } from '@angular/core';
import { LogbookEventCategory } from '../../../../core/models/logbook/logbook-event-category';
import * as _ from 'lodash';
import { PncLightModel } from '../../../../core/models/pnc-light.model';

@Component({
    selector: 'logbook-create',
    templateUrl: 'logbook-create.page.html',
})
export class LogbookCreatePage {

    logbookEvent: LogbookEventModel;
    originLogbookEvent: LogbookEventModel;

    LogbookEventModeEnum = LogbookEventModeEnum;

    logbookEventSaved = false;
    logbookEventCanceled = false;

    @ViewChild('logbookEventCreate') logbookEventCreate: LogbookEventComponent;

    constructor(private sessionService: SessionService,
        private navCtrl: NavController,
        private navParams: NavParams,
        private translateService: TranslateService,
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
    * Vérifie si le formulaire a été modifié sans être enregistré
    * @return true si il n'y a pas eu de modifications
    */
    formHasBeenModified() {
        return this.logbookEvent.eventDate != this.originLogbookEvent.eventDate
            || Utils.getHashCode(this.originLogbookEvent) !== Utils.getHashCode(this.logbookEvent);
    }
}
