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
        private fileOpener: FileOpener) {
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
        const url = URL.createObjectURL(blob);
        if (this.deviceService.isBrowser()) {
            saveAs(blob, fileName);
            window.open(url);
            this.toastService.info('Fichier téléchargé.');
        } else {
            this.toastService.info('Fichier Debut.');

            fetch('data:' + mimeType + ';base,' + base64File, {method: 'GET'})
            .then(res => res.blob()).then(blob => {
                window.file.writeFile(window.file.externalApplicationStorageDirectory, fileName, blob, { replace: true }).then(res => {
                    this.fileOpener.open(
                      res.toInternalURL(),
                      'application/pdf'
                    ).then((res) => {
      
                    }).catch(err => {
                    this.toastService.error('open error');
                    });
                }).catch(err => {
                    this.toastService.error('save error');
                  });
            }).catch( (err) => this.toastService.error('Erreur lors du téléchargement du fichier' + err));

            /*const fileTransferInstance = this.fileTransfer.create();
            this.toastService.info('Fichier Donwload...');
            fileTransferInstance.download(url, window.cordova.file.dataDirectory + fileName).then((entry) => {
                this.toastService.info('Fichier téléchargé.');
            }, (error) => this.toastService.error('Erreur lors du téléchargement du fichier'));*/
            //this.savebase64AsPDF(fileName, base64File, mimeType);
            //this.savebase64AsPDF(fileName, blob);
            //this.toastService.info('Fichier téléchargé.');
        }
    }


    /**
     * Convert a base64 string in a Blob according to the data and contentType.
     * 
     * @param b64Data {String} Pure base64 string without contentType
     * @param contentType {String} the content type of the file i.e (application/pdf - text/plain)
     * @param sliceSize {Int} SliceSize to process the byteCharacters
     * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
     * @return Blob
     */
    b64toBlob(b64Data, contentType, sliceSize = 0) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    /**
    * Create a PDF file according to its database64 content only.
    * 
    * @param folderpath {String} The folder where the file will be created
    * @param filename {String} The name of the file that will be created
    * @param content {Base64 String} Important : The content can't contain the following string (data:application/pdf;base64). Only the base64 string is expected.
    */
    savebase64AsPDF(filename, blob) {
    // Convert the base64 string in a Blob
   // const blob = this.b64toBlob(content,contentType);

    console.log("Starting to write the file :3");

    window.resolveLocalFileSystemURL(window.cordova.file.syncedDataDirectory, function(dir) {
        console.log("Access to the directory granted succesfully");
        dir.getFile(filename, {create:true}, function(file) {
            file.createWriter(function(fileWriter) {
                fileWriter.write(blob);
            }, function(){
                alert('Unable to save file in path '+ window.cordova.file.syncedDataDirectory);
            });
        });
    });
    }
}

