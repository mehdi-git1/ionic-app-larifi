import { TabHeaderEnum } from 'src/app/core/enums/tab-header.enum';
import { FlightDetailsCardModel } from './../../../../core/models/business-indicator/flight-details-card.model';
import { PncModel } from './../../../../core/models/pnc.model';
import { OnlineBusinessIndicatorService } from './../../../../core/services/business-indicator/online-business-indicator.service';
import { ActivatedRoute } from '@angular/router';
import { PncService } from './../../../../core/services/pnc/pnc.service';
import { Component } from '@angular/core';

@Component({
    selector: 'page-flight-details-card',
    templateUrl: 'flight-details-card.page.html',
    styleUrls: ['./flight-details-card.page.scss']
})
export class FlightDetailsCardPage {

    TabHeaderEnum = TabHeaderEnum;

    pnc: PncModel;
    flightDetailsCard: FlightDetailsCardModel;

    constructor(private activatedRoute: ActivatedRoute, private pncService: PncService,
                public onlineBusinessIndicatorService: OnlineBusinessIndicatorService) {
        const matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        this.pncService.getPnc(matricule).then(pnc => {
            this.pnc = pnc;
        }, error => { });
        this.onlineBusinessIndicatorService.getFlightDetailsCard(id).then(flightDetailsCard => {
            this.flightDetailsCard = flightDetailsCard;
        });
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.pnc && !!this.flightDetailsCard;
    }
}
