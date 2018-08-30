import { BaseConfig } from './base';
import { Injectable } from '@angular/core';

declare var window: any;

@Injectable()
export class Config extends BaseConfig {
    constructor() {
        super();
        this.appVersion = '1';

        if (undefined !== window.cordova && 'browser' !== window.cordova.platformId) {
            this.backEndUrl = 'https://edospnc-api-rct.airfrance.fr/api/rest/resources';
        } else {
            this.backEndUrl = '/api/rest/resources';
        }

        this.pingUrl = this.backEndUrl + '/ping';
        this.env = 'rct';
        this.secmobileEnv = 'rct';
        this.eObsUrl = 'com.airfrance.mobile.inhouse.eformsrctPNC';
        this.eObsCallbackUrl = 'com.airfrance.mobile.inhouse.edospncRCT';
    }
}
