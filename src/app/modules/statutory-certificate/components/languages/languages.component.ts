import { DatePipe } from '@angular/common';
import { LanguageModel } from './../../../../core/models/statutory-certificate/language.model';
import { MedicalAptitudesModel } from './../../../../core/models/statutory-certificate/medical-aptitudes.model';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';
@Component({
    selector: 'pnc-languages',
    templateUrl: 'languages.component.html'
})
export class LanguagesComponent implements OnInit {

    @Input() languagesData: Array<LanguageModel>;

    // Tableau des valeurs à afficher en fonction du type de tableau
    languagesDisplayedData;

    constructor(private datePipe: DatePipe) {
    }

    ngOnInit() {
        let stringOfLanguages = '';
        this.languagesData.forEach(language => {
            stringOfLanguages = stringOfLanguages + '[' + language.label + ' (' + language.code + ') : '
                + language.note + ' (' + this.datePipe.transform(language.date, 'dd/MM/yyyy') + ') ] ';
        });
        this.languagesDisplayedData = {
            headers:
                [
                    ''
                ],
            values: this.languagesData ?
                [
                    { value: [stringOfLanguages], type: 'text' }
                ]
                :
                null
        };
    }
}
