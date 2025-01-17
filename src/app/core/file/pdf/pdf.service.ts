import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Injectable({ providedIn: 'root' })
export class PdfService {

    constructor(
        private inAppBrowser: InAppBrowser,
        private file: File,
        private fileOpener: FileOpener,
        private toastService: ToastService,
        private translateService: TranslateService,
        private httpClient: HttpClient) {
    }

    /**
     * Ouvre le fichier PDF dans un lecteur PDF avec l'url concernée
     * @param url  : url de la fiche synthèse concernée
     */
    displayPDF(url) {

        const rep = this.file.dataDirectory;
        const pdfFile = 'pdfToDisplay.pdf';
        // Si on récupère un fichier PDF sur l'iPad, il faut le recréer hors des assets
        // Pour ne pas avoir une URL en localhost, il faut créer un fichier directement sur l'IPAD
        // Il y'a des problèmes CORS avec les fichiers en localhost://
        this.file.createDir(rep, 'edossier', true).then(
            createDirReturn => {
                this.file.createFile(rep + '/edossier', pdfFile, true).then(
                    createFileReturn => {
                        this.httpClient.get(url, { responseType: 'blob' }).subscribe(result => {
                            this.file.writeExistingFile(rep + '/edossier', pdfFile, result).then(
                                writingFileReturn => {
                                    this.fileOpener.open(
                                        createFileReturn.nativeURL,
                                        'application/pdf'
                                    ).then(() => { }).catch((err) => { this.errorOpeningFile(err) });
                                }
                            );
                        });
                    });
            });
    }

    /**
     * Ouvre le fichier PDF dans un lecteur PDF avec l'url concernée
     * @param base64FileContent  : contenu du fichier en  Base 64
     */
    displayPDFFromBase64(base64FileContent: string, fileName: string) {
        const rep = this.file.dataDirectory;
        this.file.writeExistingFile(rep + '/edossier', fileName, base64FileContent).then(
            writingFileReturn => {
                this.inAppBrowser.create(rep + '/edossier/' + fileName, '_blank', 'hideurlbar=no,location=no,toolbarposition=top'
                );
            }
        );
    }

    /**
    * Affiche le message d'erreur lors de l'ouverture du fichier
    */
    private errorOpeningFile(error: any) {
        this.toastService.error(this.translateService.instant('GLOBAL.DOCUMENT.OPEN_FILE_ERROR') + ' : ' + JSON.stringify(error));
    }
}
