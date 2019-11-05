

import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import {
    StatutoryCertificateDisplayTypeEnum
} from '../../../../core/enums/statutory-certificate-display-type.enum';
import { LanguageModel } from '../../../../core/models/statutory-certificate/language.model';

@Component({
    selector: 'pnc-languages',
    templateUrl: 'languages.component.html',
    styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {

    @Input() languagesData: Array<LanguageModel>;
    @Input() title: string;
    @Input() displayType: StatutoryCertificateDisplayTypeEnum;

    // Tableau des valeurs à afficher en fonction du type de tableau
    languagesDisplayedData;

    constructor(private datePipe: DatePipe) {
    }

    ngOnInit() {
        let stringOfLanguages = '';
        if (this.languagesData) {
            this.languagesData.forEach(language => {
                stringOfLanguages = stringOfLanguages + '[' + language.label + ' (' + language.code + ') : '
                    + language.note + ' (' + this.datePipe.transform(language.date, 'dd/MM/yyyy') + ') ] ';
            });
        }
        this.languagesDisplayedData = {
            headers:
                [
                    ''
                ],
            values: this.languagesData && this.languagesData.length > 0 ?
                [
                    { value: [stringOfLanguages], type: 'text' }
                ]
                :
                null
        };
    }
}
