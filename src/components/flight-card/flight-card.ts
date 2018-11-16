import { Component, Input } from '@angular/core';
import { Leg } from './../../models/leg';
import { ConnectivityService } from '../../services/connectivity/connectivity.service';

@Component({
    selector: 'flight-card',
    templateUrl: 'flight-card.html'
})
export class FlightCardComponent {

    @Input() leg: Leg;
    synchroInProgress: boolean;

    constructor(public connectivityService: ConnectivityService) {
    }

}
