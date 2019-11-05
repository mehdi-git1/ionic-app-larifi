import { Injectable } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Injectable({ providedIn: 'root' })
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
