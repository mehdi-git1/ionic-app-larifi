import { LogbookEventCreateComponent } from './../../components/logbook-event-create.component.ts/logbook-event-create.component';
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
import { Component, Input, OnInit, ViewChild, ElementRef, ViewChildren, AfterViewInit } from '@angular/core';
import { LogbookEventCategory } from '../../../../core/models/logbook/logbook-event-category';
import * as _ from 'lodash';
import { PncLightModel } from '../../../../core/models/pnc-light.model';

@Component({
    selector: 'logbook-edit',
    templateUrl: 'logbook-edit.page.html',
})
export class LogbookEditPage implements OnInit {

    logbookEvent: LogbookEventModel;
    loading: Loading;
    pnc: PncModel;

    @ViewChild('logbookEventCreate') logbookEventCreate: LogbookEventCreateComponent;

    constructor(private sessionService: SessionService,
        private navCtrl: NavController,
        public navParams: NavParams,
        private translateService: TranslateService,
        private loadingCtrl: LoadingController,
        private pncService: PncService) {
    }

    ngOnInit() {
        const matricule = this.navParams.get('matricule');
        this.pncService.getPnc(matricule).then(pnc => {
            this.pnc = pnc;
            this.logbookEvent = new LogbookEventModel();
            this.logbookEvent.pnc = new PncLightModel();
            this.logbookEvent.pnc.matricule = this.pnc.matricule;
            }, error => { });
    }

    ionViewDidLoad() {
        this.logbookEventCreate.logbookSavedEvent.subscribe(event => {
            this.navCtrl.pop();
        });
    }

    ionViewCanLeave() {
        return this.logbookEventCreate.cancelEdition();
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.logbookEvent !== undefined && this.logbookEvent !== null;
    }
}
