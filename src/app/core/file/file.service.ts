import { Injectable } from '@angular/core';

import { FileTypeEnum } from './../enums/file-type.enum';
import { HtmlService } from './html/html.service';
import { PdfService } from './pdf/pdf.service';
import { DeviceService } from '../services/device/device.service';
import { saveAs } from 'file-saver';
import { Utils } from '../../shared/utils/utils';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { ToastService } from '../services/toast/toast.service';
import { DomSanitizer } from '../../../../node_modules/@angular/platform-browser';
import { InAppBrowser } from '../../../../node_modules/@ionic-native/in-app-browser';
import { HttpClient } from '../../../../node_modules/@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

declare var window: any;
@Injectable()
export class FileService {

    constructor(
        private pdfService: PdfService,
        private htmlService: HtmlService,
        private deviceService: DeviceService,
        private fileTransfer: FileTransfer,
        private toastService: ToastService,
        private file: File,
        private fileOpener: FileOpener,
        private inAppBrowser: InAppBrowser,
        private httpClient: HttpClient,
        private translateService: TranslateService) {
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

    /**
     * Télécharge / ouvre un fichier
     * @param mimeType type du fichier
     * @param fileName  nom du fichier
     * @param base64File fichier en base64
     */
    downloadFile(mimeType: string, fileName: string, base64File: string) {
        if (this.deviceService.isBrowser()) {
            const blob = new Blob([Utils.base64ToArrayBuffer(base64File)], { type: mimeType });
            saveAs(blob, fileName);
        } else {
            const rep = this.file.dataDirectory;
            const url = this.base64FiletoUrl(base64File, mimeType);

            // Si on récupère un fichier sur l'iPad, il faut le recréer hors des assets
            // Pour ne pas avoir une URL en localhost, il faut créer un fichier directement sur l'IPAD
            // Il y'a des problèmes CORS avec les fichiers en localhost://
            this.file.createDir(rep, 'edossier', true).then(
                createDirReturn => {
                    this.file.createFile(rep + '/edossier', fileName, true).then(
                        createFileReturn => {
                            this.httpClient.get(url, { responseType: 'blob' }).subscribe(result => {
                                this.file.writeExistingFile(rep + '/edossier', fileName, result).then(
                                    writingFileReturn => {
                                        this.fileOpener.open(
                                        createFileReturn.nativeURL,
                                        mimeType
                                        ).then((res) => {
                                        }).catch(err => {
                                            this.errorOpeningFile(err);
                                        }
                                    );
                                }
                            ).catch(err => {
                                this.errorOpeningFile(err);
                            });
                        });
                    });
                }).catch(err => {
                    this.errorOpeningFile(err);
                });
        }
    }

    /**
     * Transforme un fichier base64 en url de type blob
     * @param base64File fichier en base64
     * @return url
     */
    base64FiletoUrl(base64File: string, mimeType: string): string {
        let previewSrc;
        try {
            if (base64File) {
                const file = new Blob([Utils.base64ToArrayBuffer(base64File)], { type: mimeType });
                previewSrc = URL.createObjectURL(file);
            } else {
                previewSrc = null;
            }
        } catch (error) {
            this.errorOpeningFile(error);
        }
        return previewSrc;
    }

    /**
     * Affiche le message d'erreur lors de l'ouverture du fichier
     */
    private errorOpeningFile(error: any) {
        this.toastService.error(this.translateService.instant('GLOBAL.DOCUMENT.OPEN_FILE_ERROR') + JSON.stringify(error));
    }
}

