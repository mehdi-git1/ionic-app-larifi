

import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import {
    StatutoryCertificateDisplayTypeEnum
} from '../../../../core/enums/statutory-certificate-display-type.enum';
import {
    TravelDocumentsModel
} from '../../../../core/models/statutory-certificate/travel-documents.model';

@Component({
    selector: 'travel-documents',
    templateUrl: 'travel-documents.component.html',
    styleUrls: ['./travel-documents.component.scss']
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
        if (this.travelDocumentsData) {
            this.travelDocumentsData.forEach(travelDocument => {
                stringOfTravelDocument = stringOfTravelDocument + '[' + travelDocument.label + ' (' + travelDocument.code + ') : '
                    + ' (' + this.datePipe.transform(travelDocument.date, 'dd/MM/yyyy') + ') ] ';
            });
        }
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
