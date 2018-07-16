import { BaseConfig } from './base';
import { Injectable } from '@angular/core';


declare var window: any;


@Injectable()
export class Config extends BaseConfig {
    constructor() {
        super();
        this.appVersion = '1';

        if (undefined !== window.cordova && 'browser' !== window.cordova.platformId) {
            console.log('mobile mode selected');
            this.pingUrl = 'https://edospnc-api-rct.airfrance.fr/api/rest/resources/me';
            this.backEndUrl = 'https://edospnc-api-rct.airfrance.fr/api/rest/resources';
        } else {
            console.log('web mode selected');
            this.backEndUrl = '/api/rest/resources';
            // this.pingUrl = 'https://edospnc-rct.airfrance.fr/api/rest/resources/me';
            // this.backEndUrl = 'https://edospnc-rct.airfrance.fr/api/rest/resources';
        }

        this.env = 'localhost';
        this.secmobileEnv = 'rct';
        this.eObsUrl = 'com.airfrance.mobile.inhouse.eformsrctPNC';
        this.eObsCallbackUrl = 'com.airfrance.mobile.inhouse.EDosPNC';
    }
}
