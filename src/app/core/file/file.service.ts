import { Injectable } from '@angular/core';

import { FileTypeEnum } from './../enums/file-type.enum';
import { HtmlService } from './html/html.service';
import { PdfService } from './pdf/pdf.service';
import { DeviceService } from '../services/device/device.service';
import { saveAs } from 'file-saver';
import { Utils } from '../../shared/utils/utils';
import { FileTransfer} from '@ionic-native/file-transfer';
import { ToastController } from '../../../../node_modules/ionic-angular/umd';
import { ToastService } from '../services/toast/toast.service';

declare var window: any;
@Injectable()
export class FileService {

    constructor(
        private pdfService: PdfService,
        private htmlService: HtmlService,
        private deviceService: DeviceService,
        private file: File,
        private fileTransfer: FileTransfer,
        private toastService: ToastService) {
    }

    /**
     * Affiche un fichier en fonction de son type
     * @param type Type de fichier a afficher
     * @param url url du fichier à afficher
     */
    displayFile(type, url) {
        if (this.deviceService.isBrowser() || type === FileTypeEnum.URL) {
            this.htmlService.displayHTML(url);
        } else if (type === FileTypeEnum.PDF) {
            this.pdfService.displayPDF(url);
        }
    }

    downloadFile(mimeType: string, fileName: string, base64File: string) {
        const blob = new Blob([Utils.base64ToArrayBuffer(base64File)], { type: mimeType });
        var url = URL.createObjectURL(blob);
        saveAs(blob, fileName);
        if (this.deviceService.isBrowser()) {
            window.open(url);
            this.toastService.info('Fichier téléchargé.');
        } else {
            const fileTransferInstance = this.fileTransfer.create();
            fileTransferInstance.download(url, window.cordova.file.dataDirectory + fileName).then((entry) => {
                this.toastService.info('Fichier téléchargé.');
            }, (error) => this.toastService.error('Erreur lors du téléchargement du fichier'));
        }
    }
}

