import { Component, Input } from '@angular/core';

import { LegModel } from '../../../../core/models/leg.model';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';

@Component({
    selector: 'flight-card',
    templateUrl: 'flight-card.component.html',
    styleUrls: ['./flight-card.component.scss']
})
export class FlightCardComponent {

    @Input() leg: LegModel;
    synchroInProgress: boolean;

    constructor(public connectivityService: ConnectivityService) {
    }

}
