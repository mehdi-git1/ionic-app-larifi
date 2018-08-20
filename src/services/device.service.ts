import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';

declare var window: any;

@Injectable()
export class DeviceService {


    constructor(
        public platform: Platform) {
    }

    /**
     * Détermine si on est sur navigateur ou sur mobile.
     * @return vrai si on est sur navigateur, faux sinon.
     */
    isBrowser(): boolean {
        return window.device && window.device.platform === 'browser' || !this.platform.is('cordova');
    }
}
