import { Injectable } from '@angular/core';

import { FileTypeEnum } from './../enums/file-type.enum';
import { HtmlService } from './html/html.service';
import { PdfService } from './pdf/pdf.service';
import { DeviceService } from '../services/device/device.service';

@Injectable()
export class FileService {

    constructor(
        private pdfService: PdfService,
        private htmlService: HtmlService,
        private deviceService: DeviceService) {
    }

    displayFile(type, url) {
        if (this.deviceService.isBrowser() || type === FileTypeEnum.URL) {
            this.htmlService.displayHTML(url);
        } else if (type === FileTypeEnum.PDF) {
            this.pdfService.displayPDF(url);
        }
    }
}

