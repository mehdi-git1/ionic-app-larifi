import { Injectable } from '@angular/core';

import { BaseEnvironment } from './base-environment';

declare var window: any;

@Injectable()
export class Config extends BaseEnvironment {
    constructor() {
        super();

        if (undefined !== window.cordova && 'browser' !== window.cordova.platformId) {
            this.contextRoot = 'https://edospnc-api-fix-dev.airfrance.fr/api/';
        }

        this.backEndUrl = `${this.contextRoot}rest/resources`;
        this.versionFileUrl = `${this.contextRoot}version.json`;
        this.env = 'dev2';
        this.secmobileEnv = 'rct';
        this.eformsUrl = 'com.airfrance.mobile.inhouse.eformsdevPNC';
        this.eformsCallbackUrl = 'com.airfrance.mobile.inhouse.edospncDEV2';
    }
}
