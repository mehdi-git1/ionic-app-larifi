

import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import {
    StatutoryCertificateDisplayTypeEnum
} from '../../../../core/enums/statutory-certificate-display-type.enum';
import { RelayModel } from '../../../../core/models/statutory-certificate/relay.model';

@Component({
    selector: 'pnc-relays',
    templateUrl: 'relays.component.html',
    styleUrls: ['./relays.component.scss']
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
