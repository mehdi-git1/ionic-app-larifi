import { Events, Loading, NavParams } from 'ionic-angular';
import * as _ from 'lodash';

import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { LogbookEventModeEnum } from '../../../../core/enums/logbook-event/logbook-event-mode.enum';
import { LogbookEventTypeEnum } from '../../../../core/enums/logbook-event/logbook-event-type.enum';
import { TextEditorModeEnum } from '../../../../core/enums/text-editor-mode.enum';
import { LogbookEventModel } from '../../../../core/models/logbook/logbook-event.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { SecurityService } from '../../../../core/services/security/security.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { DateTransform } from '../../../../shared/utils/date-transform';

@Component({
    selector: 'logbook-event-details',
    templateUrl: 'logbook-event-details.component.html',
})
export class LogbookEventDetailsComponent implements OnInit {

    @Input() logbookEvent: LogbookEventModel;

    @Output() editionOrDeletion: EventEmitter<any> = new EventEmitter();

    editEvent = false;
    eventDateString: string;
    monthsNames: string;
    pnc: PncModel;
    loading: Loading;

    originLogbookEvent: LogbookEventModel;

    LogbookEventTypeEnum = LogbookEventTypeEnum;
    TextEditorModeEnum = TextEditorModeEnum;

    constructor(private navParams: NavParams,
        private securityService: SecurityService,
        private translateService: TranslateService,
        private sessionService: SessionService,
        private dateTransformer: DateTransform,
        private datePipe: DatePipe,
        private events: Events) {
        // Traduction des mois
        this.monthsNames = this.translateService.instant('GLOBAL.MONTH.LONGNAME');

        this.events.subscribe('LinkedLogbookEvent:canceled', () => {
            this.editEvent = false;
        });

        this.events.subscribe('LogbookEvent:saved', () => {
            this.editEvent = false;
        });
    }

    ngOnInit() {
        if (this.sessionService.visitedPnc) {
            this.pnc = this.sessionService.visitedPnc;
        } else {
            this.pnc = this.sessionService.getActiveUser().authenticatedPnc;
        }
        this.originLogbookEvent = _.cloneDeep(this.logbookEvent);
        this.eventDateString = this.logbookEvent ? this.logbookEvent.eventDate : this.dateTransformer.transformDateToIso8601Format(new Date());
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
     * Affiche le message d'information de la dernière modification faite sur l'évènement
     */
    showInformationMessage() {
        return this.logbookEvent.lastUpdateAuthor && this.logbookEvent.lastUpdateDate !== this.logbookEvent.creationDate;
    }
}
