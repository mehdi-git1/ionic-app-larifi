import { DeviceService } from 'src/app/core/services/device/device.service';

import { Injectable } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Injectable({ providedIn: 'root' })
export class HtmlService {

    constructor(
        private inAppBrowser: InAppBrowser,
        private deviceService: DeviceService
    ) { }

    /**
     * Ouvre une fenêtre de navigation avec l'url concernée
     * @param url  : url de la fiche synthèse concernée
     */
    displayHTML(url) {
        this.inAppBrowser.create(url, '_system', '');
    }
}
