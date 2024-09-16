import { Injectable } from '@angular/core';

import { BaseEnvironment } from './base-environment';

declare var window: any;

@Injectable({ providedIn: 'root' })
export class Config extends BaseEnvironment {
    constructor() {
        super();

        if (undefined !== window.cordova && 'browser' !== window.cordova.platformId) {
            this.contextRoot = 'https://edospnc-api-az-dev.airfrance.fr/api/';
        }

        this.backEndUrl = `${this.contextRoot}rest/resources`;
        this.versionFileUrl = `${this.contextRoot}version.json`;
        this.env = 'dev';
        this.secmobileEnv = 'rct';
        this.eformsUrl = 'com.airfrance.mobile.inhouse.eformsdevPNC';
        this.eformsCallbackUrl = 'com.airfrance.mobile.inhouse.edospncDEV';

        this.friendlyUrl = 'http://friendly6rct.airfrance.fr';
    }
}
