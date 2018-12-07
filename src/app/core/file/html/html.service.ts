import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Injectable } from '@angular/core';

@Injectable()
export class HtmlService {

    constructor(
        private inAppBrowser: InAppBrowser) {
    }

    /**
    * Ouvre une fenêtre de navigation avec l'url concernée
    * @param url  : url de la fiche synthèse concernée
    */
    displayHTML(url) {
        this.inAppBrowser.create(url, '_system', '');
    }
}
