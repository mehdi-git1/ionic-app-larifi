import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { Config } from '../../../../environments/config';

declare var window: any;

@Injectable({ providedIn: 'root' })
export class DeviceService {


    constructor(
        public platform: Platform,
        private config: Config) {
    }

    /**
     * Détermine si on est sur navigateur ou sur mobile.
     * @return vrai si on est sur navigateur, faux sinon.
     */
    isBrowser(): boolean {
        return window.device && window.device.platform === 'browser' || !this.platform.is('cordova');
    }

    /**
     * Détermine si le mode déconnecté est possible
     * @return vrai si le mode déconnecté est disponible, faux sinon
     */
    isOfflineModeAvailable(): boolean {
        return this.config.makeOfflineModeAvailable || !this.isBrowser();
    }
}
