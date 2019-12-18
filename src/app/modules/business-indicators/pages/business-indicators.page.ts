import { BusinessIndicatorModel } from './../../../core/models/business-indicator/business-indicator.model';
import { OnlineBusinessIndicatorService } from './../../../core/services/business-indicator/online-business-indicator.service';
import { PncService } from './../../../core/services/pnc/pnc.service';
import { PncModel } from './../../../core/models/pnc.model';
import { TabHeaderEnum } from 'src/app/core/enums/tab-header.enum';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'page-business-indicators',
    templateUrl: 'business-indicators.page.html',
    styleUrls: ['./business-indicators.page.scss']
})
export class BusinessIndicatorsPage {
    TabHeaderEnum = TabHeaderEnum;
    pnc: PncModel;
    businessIndicator: BusinessIndicatorModel;

    constructor(private activatedRoute: ActivatedRoute, private pncService: PncService,
                public onlineBusinessIndicatorService: OnlineBusinessIndicatorService) {
        const matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
        this.pncService.getPnc(matricule).then(pnc => {
            this.pnc = pnc;
        }, error => { });
        this.onlineBusinessIndicatorService.getBusinessIndicator(matricule).then(businessIndicator => {
            this.businessIndicator = businessIndicator;
        });
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.pnc && !!this.businessIndicator ;
    }
}
