import { SecurityService } from './../../../../core/services/security/security.service';
import { NavController } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { LogbookEventModel } from '../../../../core/models/logbook/logbook-event.model';
import { OnlineLogbookEventService } from '../../../../core/services/logbook/online-logbook-event.service';
@Component({
    selector: 'logbook-event-details',
    templateUrl: 'logbook-event-details.component.html'
})
export class LogbookEventDetailsComponent {

    @Input() logbookEvent: LogbookEventModel;

    constructor(
        private securityService: SecurityService) {
    }


    /**
     * Vérifie si le PNC est manager
     * @return vrai si le PNC est manager, faux sinon
     */
    isManager(): boolean {
        return this.securityService.isManager();
    }
}
