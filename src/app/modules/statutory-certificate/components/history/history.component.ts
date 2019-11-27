import { ConnectivityService } from './../../../../core/services/connectivity/connectivity.service';
import { DwhHistoryModel } from './../../../../core/models/dwh-history/dwh-history.model';
import { StatutoryCertificateModel } from './../../../../core/models/statutory.certificate.model';
import { Component, Input, OnInit } from '@angular/core';
import {
    StatutoryCertificateDisplayTypeEnum
} from '../../../../core/enums/statutory-certificate-display-type.enum';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'history',
    templateUrl: 'history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

    @Input() history: DwhHistoryModel;

    dwhHistoryDisplayedData;
    tempDwhHistoryDisplayedData;

    StatutoryCertificateDisplayTypeEnum = StatutoryCertificateDisplayTypeEnum;

    constructor(private connectivityService: ConnectivityService, private translateService: TranslateService) {
        this.tempDwhHistoryDisplayedData = {
            assignmentCode: new Array(),
            division: new Array(),
            startDate: new Array(),
            label: new Array(),
            sector: new Array(),
            endDate: new Array()
        };
    }

    /**
     * Vérifie si on est hors ligne
     * @return true si on est hors ligne, false sinon
     */
    isOffline() {
        return !this.connectivityService.isConnected();
    }

    ngOnInit() {
        if (this.history && this.history.assignmentHistory && this.history.assignmentHistory.length > 0) {
            for (const assignmentHistory of this.history.assignmentHistory) {
              this.tempDwhHistoryDisplayedData.division.push(assignmentHistory.division);
              this.tempDwhHistoryDisplayedData.endDate.push(assignmentHistory.endDate);
              this.tempDwhHistoryDisplayedData.label.push(assignmentHistory.label);
              this.tempDwhHistoryDisplayedData.sector.push(assignmentHistory.sector);
              this.tempDwhHistoryDisplayedData.startDate.push(assignmentHistory.startDate);
              this.tempDwhHistoryDisplayedData.assignmentCode.push(assignmentHistory.assignmentCode);
            }
        }
        this.dwhHistoryDisplayedData =  {
        headers:
            [
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.ASSIGNMENT.CODE'),
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.ASSIGNMENT.LABEL'),
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.ASSIGNMENT.DIVISION'),
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.ASSIGNMENT.SECTOR'),
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.ASSIGNMENT.START_DATE'),
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.ASSIGNMENT.END_DATE')
            ],
        values:
            [
            { value: this.tempDwhHistoryDisplayedData.assignmentCode, type: 'assignmentCode' },
            { value: this.tempDwhHistoryDisplayedData.label, type: 'label' },
            { value: this.tempDwhHistoryDisplayedData.division, type: 'division' },
            { value: this.tempDwhHistoryDisplayedData.sector, type: 'sector' },
            { value: this.tempDwhHistoryDisplayedData.startDate, type: 'date' },
            { value: this.tempDwhHistoryDisplayedData.endDate, type: 'date' }
            ]
        };
    }
}
