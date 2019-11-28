import { AppConstant } from './../../../../app.constant';
import { ConnectivityService } from './../../../../core/services/connectivity/connectivity.service';
import { DwhHistoryModel } from './../../../../core/models/dwh-history/dwh-history.model';
import { StatutoryCertificateModel } from './../../../../core/models/statutory.certificate.model';
import { Component, Input, OnInit } from '@angular/core';
import {
    StatutoryCertificateDisplayTypeEnum
} from '../../../../core/enums/statutory-certificate-display-type.enum';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
    selector: 'history',
    templateUrl: 'history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

    @Input() history: DwhHistoryModel;

    assignmentData;
    employmentLevelData;
    instrumentData;
    seniorityDateData;
    examData;
    StatutoryCertificateDisplayTypeEnum = StatutoryCertificateDisplayTypeEnum;

    constructor(private connectivityService: ConnectivityService, private translateService: TranslateService) {

    }

    /**
     * Vérifie si on est hors ligne
     * @return true si on est hors ligne, false sinon
     */
    isOffline() {
        return !this.connectivityService.isConnected();
    }

    ngOnInit() {
        this.initAssignmentData();
        this.initEmploymentLevelData();
        this.initInstrumentData();
        this.initSeniorityDateData();
        this.initExamData();
    }

    /**
     * Initialise l'affichage de l'historique des affectations
     */
    initAssignmentData() {
        const tempDwhHistoryDisplayedData = {
            assignmentCode: new Array(),
            division: new Array(),
            startDate: new Array(),
            label: new Array(),
            sector: new Array(),
            endDate: new Array()
        };
        if (this.history && this.history.assignmentHistory && this.history.assignmentHistory.length > 0) {
            const sortedAssignmentHistory = this.history.assignmentHistory.sort((assignment1, assignment2) => {
                return moment(assignment1.startDate, AppConstant.isoDateFormat)
                .isBefore(moment(assignment2.startDate, AppConstant.isoDateFormat))
                ? 1 : -1;
            });
            for (const assignmentHistory of sortedAssignmentHistory) {
              tempDwhHistoryDisplayedData.division.push(assignmentHistory.division);
              tempDwhHistoryDisplayedData.endDate.push(assignmentHistory.endDate);
              tempDwhHistoryDisplayedData.label.push(assignmentHistory.label);
              tempDwhHistoryDisplayedData.sector.push(assignmentHistory.sector);
              tempDwhHistoryDisplayedData.startDate.push(assignmentHistory.startDate);
              tempDwhHistoryDisplayedData.assignmentCode.push(assignmentHistory.assignmentCode);
            }
        }
        this.assignmentData =  {
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
            { value: tempDwhHistoryDisplayedData.assignmentCode, type: 'assignmentCode' },
            { value: tempDwhHistoryDisplayedData.label, type: 'label' },
            { value: tempDwhHistoryDisplayedData.division, type: 'division' },
            { value: tempDwhHistoryDisplayedData.sector, type: 'sector' },
            { value: tempDwhHistoryDisplayedData.startDate, type: 'date' },
            { value: tempDwhHistoryDisplayedData.endDate, type: 'date' }
            ]
        };
    }

    /**
     * Initialise l'affichage de l'historique des niveaux d'emploi
     */
    initEmploymentLevelData() {
        const tempDwhHistoryDisplayedData = {
            grade: new Array(),
            level: new Array(),
            speciality: new Array(),
            startDate: new Array(),
            endDate: new Array()
        };
        if (this.history && this.history.employmentLevelHistory && this.history.employmentLevelHistory.length > 0) {
            const sortedEmploymentLevelHistory = this.history.employmentLevelHistory.sort((employmentLevel1, employmentLevel2) => {
                return moment(employmentLevel1.startDate, AppConstant.isoDateFormat)
                .isBefore(moment(employmentLevel2.startDate, AppConstant.isoDateFormat))
                ? 1 : -1;
            });
            for (const employmentLevelHistory of sortedEmploymentLevelHistory) {
              tempDwhHistoryDisplayedData.grade.push(employmentLevelHistory.grade);
              tempDwhHistoryDisplayedData.level.push(employmentLevelHistory.level);
              tempDwhHistoryDisplayedData.speciality.push(employmentLevelHistory.speciality);
              tempDwhHistoryDisplayedData.startDate.push(employmentLevelHistory.startDate);
              tempDwhHistoryDisplayedData.endDate.push(employmentLevelHistory.endDate);
            }
        }
        this.employmentLevelData =  {
        headers:
            [
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.EMPLOYMENT_LEVEL.GRADE'),
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.EMPLOYMENT_LEVEL.LEVEL'),
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.EMPLOYMENT_LEVEL.SPECIALITY'),
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.EMPLOYMENT_LEVEL.START_DATE'),
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.EMPLOYMENT_LEVEL.END_DATE')
            ],
        values:
            [
            { value: tempDwhHistoryDisplayedData.grade, type: 'grade' },
            { value: tempDwhHistoryDisplayedData.level, type: 'level' },
            { value: tempDwhHistoryDisplayedData.speciality, type: 'speciality' },
            { value: tempDwhHistoryDisplayedData.startDate, type: 'date' },
            { value: tempDwhHistoryDisplayedData.endDate, type: 'date' }
            ]
        };
    }

    /**
     * Initialise l'affichage de l'historique des instruments (Ginq)
     */
    initInstrumentData() {
        const tempDwhHistoryDisplayedData = {
            code: new Array(),
            instructor: new Array(),
            startDate: new Array(),
            endDate: new Array()
        };
        if (this.history && this.history.instrumentHistory && this.history.instrumentHistory.length > 0) {
            const sortedInstrumentHistory = this.history.instrumentHistory.sort((instrument1, instrument2) => {
                return moment(instrument1.startDate, AppConstant.isoDateFormat)
                .isBefore(moment(instrument2.startDate, AppConstant.isoDateFormat))
                ? 1 : -1;
            });
            for (const instrument of sortedInstrumentHistory) {
              tempDwhHistoryDisplayedData.code.push(instrument.code);
              tempDwhHistoryDisplayedData.instructor.push(instrument.instructor);
              tempDwhHistoryDisplayedData.startDate.push(instrument.startDate);
              tempDwhHistoryDisplayedData.endDate.push(instrument.endDate);
            }
        }
        this.instrumentData =  {
        headers:
            [
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.INSTRUMENT.CODE'),
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.INSTRUMENT.INSTRUCTOR'),
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.INSTRUMENT.START_DATE'),
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.INSTRUMENT.END_DATE')
            ],
        values:
            [
            { value: tempDwhHistoryDisplayedData.code, type: 'code' },
            { value: tempDwhHistoryDisplayedData.instructor, type: 'instructor' },
            { value: tempDwhHistoryDisplayedData.startDate, type: 'date' },
            { value: tempDwhHistoryDisplayedData.endDate, type: 'date' }
            ]
        };
    }

    /**
     * Initialise l'affichage de l'historique des dates d'ancienneté
     */
    initSeniorityDateData() {
        const tempDwhHistoryDisplayedData = {
            effectiveDate: new Array(),
            event: new Array(),
            nature: new Array()
        };
        if (this.history && this.history.seniorityDateHistory && this.history.seniorityDateHistory.length > 0) {
            const sortedSeniorityDateHistory = this.history.seniorityDateHistory.sort((seniorityDate1, seniorityDate2) => {
                return moment(seniorityDate1.effectiveDate, AppConstant.isoDateFormat)
                .isBefore(moment(seniorityDate2.effectiveDate, AppConstant.isoDateFormat))
                ? 1 : -1;
            });
            for (const seniorityDate of sortedSeniorityDateHistory) {
              tempDwhHistoryDisplayedData.effectiveDate.push(seniorityDate.effectiveDate);
              tempDwhHistoryDisplayedData.event.push(seniorityDate.event);
              tempDwhHistoryDisplayedData.nature.push(seniorityDate.nature);
            }
        }
        this.seniorityDateData =  {
        headers:
            [
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.SENIORITY_DATE.EFFECTIVE_DATE'),
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.SENIORITY_DATE.EVENT'),
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.SENIORITY_DATE.NATURE')
            ],
        values:
            [
            { value: tempDwhHistoryDisplayedData.effectiveDate, type: 'date' },
            { value: tempDwhHistoryDisplayedData.event, type: 'event' },
            { value: tempDwhHistoryDisplayedData.nature, type: 'nature' }
            ]
        };
    }

    /**
     * Initialise l'affichage de l'historique des examens
     */
    initExamData() {
        const tempDwhHistoryDisplayedData = {
            type: new Array(),
            label: new Array(),
            notation: new Array(),
            examDate: new Array()
        };
        if (this.history && this.history.examHistory && this.history.examHistory.length > 0) {
            const sortedExamHistory = this.history.examHistory.sort((exam1, exam2) => {
                return moment(exam1.examDate, AppConstant.isoDateFormat)
                .isBefore(moment(exam2.examDate, AppConstant.isoDateFormat))
                ? 1 : -1;
            });
            for (const examHistory of sortedExamHistory) {
              tempDwhHistoryDisplayedData.type.push(examHistory.type);
              tempDwhHistoryDisplayedData.label.push(examHistory.label);
              tempDwhHistoryDisplayedData.notation.push(examHistory.notation);
              tempDwhHistoryDisplayedData.examDate.push(examHistory.examDate);
            }
        }
        this.examData =  {
        headers:
            [
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.EXAM_DATE.TYPE'),
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.EXAM_DATE.LABEL'),
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.EXAM_DATE.CODE'),
            this.translateService.instant('STATUTORY_CERTIFICATE.HISTORY.EXAM_DATE.EXAM_DATE')
            ],
        values:
            [
            { value: tempDwhHistoryDisplayedData.type, type: 'type' },
            { value: tempDwhHistoryDisplayedData.label, type: 'label' },
            { value: tempDwhHistoryDisplayedData.notation, type: 'code' },
            { value: tempDwhHistoryDisplayedData.examDate, type: 'date' }
            ]
        };
    }
}
