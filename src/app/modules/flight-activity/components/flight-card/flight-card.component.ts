import { Component, Input } from '@angular/core';

import { LegModel } from '../../../../core/models/leg.model';

@Component({
    selector: 'flight-card',
    templateUrl: 'flight-card.component.html',
    styleUrls: ['./flight-card.component.scss']
})
export class FlightCardComponent {

    @Input() flight: LegModel;
}
