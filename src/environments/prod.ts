import { Injectable } from '@angular/core';

import { BaseEnvironment } from './base-environment';

declare var window: any;
@Injectable()
export class Config extends BaseEnvironment {
    constructor() {
        super();
        this.appVersion = '1';

        if (undefined !== window.cordova && 'browser' !== window.cordova.platformId) {
            this.contextRoot = 'https://edospnc-api.airfrance.fr/api/';
        } else {
            this.backEndUrl = '/api/rest/resources';
        }

        this.env = 'prod';
        this.secmobileEnv = 'prod';
        this.eObsUrl = 'com.airfrance.mobile.inhouse.eformsPNC';
        this.eObsCallbackUrl = 'com.airfrance.mobile.inhouse.edospnc';
    }
}
