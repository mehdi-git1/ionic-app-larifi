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

    constructor(private activatedRoute: ActivatedRoute, private pncService: PncService) {
        const matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
        this.pncService.getPnc(matricule).then(pnc => {
            this.pnc = pnc;
        }, error => { });
    }
}
