import { DatePipe } from '@angular/common';
import { LanguageModel } from './../../../../core/models/statutory-certificate/language.model';
import { Component, Input, OnInit } from '@angular/core';

import * as _ from 'lodash';
import { StatutoryCertificateDisplayTypeEnum } from '../../../../core/enums/statutory-certificate-display-type.enum';
import { TravelDocumentsModel } from '../../../../core/models/statutory-certificate/travel-documents.model';
@Component({
    selector: 'travel-documents',
    templateUrl: 'travel-documents.component.html'
})
export class TravelDocumentsComponent implements OnInit {

    @Input() travelDocumentsData: Array<TravelDocumentsModel>;
    @Input() title: string;
    @Input() displayType: StatutoryCertificateDisplayTypeEnum;

    // Tableau des valeurs à afficher en fonction du type de tableau
    travelDocumentsDisplayedData;

    constructor(private datePipe: DatePipe) {
    }

    ngOnInit() {
        let stringOfTravelDocument = '';
        this.travelDocumentsData.forEach(travelDocument => {
            stringOfTravelDocument = stringOfTravelDocument + '[' + travelDocument.label + ' (' + travelDocument.code + ') : '
                + ' (' + this.datePipe.transform(travelDocument.date, 'dd/MM/yyyy') + ') ] ';
        });
        this.travelDocumentsDisplayedData = {
            headers:
                [
                    ''
                ],
            values: this.travelDocumentsData && this.travelDocumentsData.length > 0 ?
                [
                    { value: [stringOfTravelDocument], type: 'text' }
                ]
                :
                null
        };
    }
}
