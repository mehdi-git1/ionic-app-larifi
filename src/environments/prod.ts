import { Injectable } from '@angular/core';

import { BaseEnvironment } from './base-environment';

declare var window: any;
@Injectable({ providedIn: 'root' })
export class Config extends BaseEnvironment {
    constructor() {
        super();

        if (undefined !== window.cordova && 'browser' !== window.cordova.platformId) {
            this.contextRoot = 'https://edospnc-api.airfrance.fr/api/';
        }

        this.backEndUrl = `${this.contextRoot}rest/resources`;
        this.versionFileUrl = `${this.contextRoot}version.json`;
        this.env = 'prod';
        this.secmobileEnv = 'prod';
        this.eformsUrl = 'com.airfrance.mobile.inhouse.eformsPNC';
        this.eformsCallbackUrl = 'com.airfrance.mobile.inhouse.edospnc';

        this.friendlyUrl = 'http://friendly.airfrance.fr';

    }
}
