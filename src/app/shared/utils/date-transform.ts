import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

import { AppConstant } from '../../app.constant';

@Injectable({ providedIn: 'root' })
export class DateTransform {

    constructor(private datePipe: DatePipe) {
    }

    /**
     * Transforme la date
     * @param dateToTransform date à transformer
     * @return date au format dd/MM/yyyy
     */
    formatDateInDay(dateToTransform: Date): string {
        return this.datePipe.transform(dateToTransform, AppConstant.dateFormat);
    }

    /**
     * Transforme la date en format ISO 8601
     * @param dateToTransform date à transformer
     * @return date au format ISO 8601
     */
    transformDateToIso8601Format(dateToTransform: Date): string {
        return this.datePipe.transform(dateToTransform, AppConstant.iso8601DateTimeFormat);
    }

    /**
     * Transforme la date en format ISO 8601
     * @param dateToTransform date à transformer
     * @return date au format ISO 8601
     */
    transformDateStringToIso8601Format(dateToTransform: string): string {
        if (!dateToTransform) {
            return null;
        }
        if (!dateToTransform.includes('T')) {
            dateToTransform = dateToTransform + 'T12:00';
        }
        return this.datePipe.transform(dateToTransform, AppConstant.iso8601DateTimeFormat);
    }
}
