import { AppConstant } from './../app/app.constant';
import { DatePipe } from '@angular/common';

import { Injectable } from '@angular/core';



@Injectable()
export class DateTransformService {

    constructor(private datePipe: DatePipe) {
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
        if (!dateToTransform.includes('T')) {
            dateToTransform = dateToTransform + 'T12:00';
        }
        return this.datePipe.transform(dateToTransform, AppConstant.iso8601DateTimeFormat);
    }
}
