import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpClient } from '@angular/common/http';
import { File } from '@ionic-native/file';
import { Injectable } from '@angular/core';

@Injectable()
export class PdfService {

    constructor(
        private inAppBrowser: InAppBrowser,
        private file: File,
        private httpClient: HttpClient) {
    }

    /**
    * Ouvre le fichier PDF dans un lecteur PDF avec l'url concernée
    * @param url  : url de la fiche synthèse concernée
    */
    displayPDF(url) {

        const rep = this.file.dataDirectory;
        // Si on récupère un fichier PDF sur l'iPad, il faut le recréer hors des assets
        // Pour ne pas avoir une URL en localhost, il faut créer un fichier directement sur l'IPAD
        // Il y'a des problèmes CORS avec les fichiers en localhost://
        this.file.createDir(rep, 'edossier', true).then(
            createDirReturn => {
                this.file.createFile(rep + '/edossier', 'pdfToDisplay.pdf', true).then(
                    createFileReturn => {
                        this.httpClient.get(url, { responseType: 'blob' }).subscribe(result => {
                            this.file.writeExistingFile(rep + '/edossier', 'pdfToDisplay.pdf', result).then(
                                writingFileReturn => {
                                    this.inAppBrowser.create(rep + '/edossier/' + 'pdfToDisplay.pdf', '_blank', 'hideurlbar=no,location=no,toolbarposition=top'
                                    );
                                }
                            );
                        });
                    });
            });
    }
}
