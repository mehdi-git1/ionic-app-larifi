import { DatePipe } from '@angular/common';
import { RelayModel } from './../../../../core/models/statutory-certificate/relay.model';
import { Component, Input, OnInit } from '@angular/core';

import * as _ from 'lodash';
import { StatutoryCertificateDisplayTypeEnum } from '../../../../core/enums/statutory-certificate-display-type.enum';
@Component({
    selector: 'pnc-relays',
    templateUrl: 'relays.component.html'
})
export class RelaysComponent implements OnInit {

    @Input() relaysData: Array<RelayModel>;
    @Input() title: string;
    @Input() displayType: StatutoryCertificateDisplayTypeEnum;

    // Tableau des valeurs à afficher en fonction du type de tableau
    relaysDisplayedData;

    constructor(private datePipe: DatePipe) {
    }

    ngOnInit() {
        let stringOfRelays = '';
        this.relaysData.forEach(relay => {
            stringOfRelays = stringOfRelays + '[' + relay.label + ' : '
                + this.datePipe.transform(relay.startDate, 'dd/MM/yyyy') + '] ';
        });
        this.relaysDisplayedData = {
            headers:
                [
                    ''
                ],
            values: this.relaysData && this.relaysData.length > 0 ?
                [
                    { value: [stringOfRelays], type: 'text' }
                ]
                :
                null
        };
    }
}
