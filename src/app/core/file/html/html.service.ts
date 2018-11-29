import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Injectable } from '@angular/core';

@Injectable()
export class HtmlService {

    constructor(
        private inAppBrowser: InAppBrowser) {
    }

    /**
    * Ouvre une fenetre de navigation avec l'url conçernée
    * @param url  : url de la fiche synthése concernée
    */
    displayHTML(url) {
        this.inAppBrowser.create(url, '_system', '');
    }
}
