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
            this.backEndUrl = 'https://edospnc-api.airfrance.fr/api/rest/resources';
            this.pingUrl = this.backEndUrl + '/me';
        } else {
            console.log('web mode selected');
            this.backEndUrl = '/api/rest/resources';
        }

        this.env = 'prod';
        this.secmobileEnv = 'prod';
        this.eObsUrl = 'com.airfrance.mobile.inhouse.eformsrctPNC';
        this.eObsCallbackUrl = 'com.airfrance.mobile.inhouse.edosPNC';
    }
}
