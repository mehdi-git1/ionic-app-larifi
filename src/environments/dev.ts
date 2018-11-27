import { Injectable } from '@angular/core';

import { BaseEnvironment } from './base-environment';

declare var window: any;

@Injectable()
export class Config extends BaseEnvironment {
    constructor() {
        super();
        this.appVersion = '1';

        if (undefined !== window.cordova && 'browser' !== window.cordova.platformId) {
            this.backEndUrl = 'https://edospnc-api-dev.airfrance.fr/api/rest/resources';
            this.backEndVersionUrl = 'https://edospnc-api-dev.airfrance.fr/api/version.json';
        } else {
            this.backEndUrl = '/api/rest/resources';
        }

        this.env = 'dev';
        this.secmobileEnv = 'rct';
        this.eObsUrl = 'com.airfrance.mobile.inhouse.eformsdevPNC';
        this.eObsCallbackUrl = 'com.airfrance.mobile.inhouse.edospncDEV';
    }
}
