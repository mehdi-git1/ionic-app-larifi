import { BaseConfig } from './base';
import { Injectable } from '@angular/core';

declare var window: any;

@Injectable()
export class Config extends BaseConfig {
    constructor() {
        super();
        this.appVersion = '1';

        if (undefined !== window.cordova && 'browser' !== window.cordova.platformId) {
            this.backEndUrl = 'https://edospnc-api-dev.airfrance.fr/api/rest/resources';
            this.pingUrl = this.backEndUrl + '/me';
        } else {
            this.backEndUrl = '/api/rest/resources';
            // A décommenter pour travailler en localhost (sans tomcat)
            // this.backEndUrl = 'https://edospnc-dev.airfrance.fr/api/rest/resources';
            // this.pingUrl = this.backEndUrl + '/me';
        }

        this.env = 'localhost';
        this.secmobileEnv = 'rct';
        this.eObsUrl = 'com.airfrance.mobile.inhouse.eformsrctPNC';
        this.eObsCallbackUrl = 'com.airfrance.mobile.inhouse.EDosPNC';
    }
}
