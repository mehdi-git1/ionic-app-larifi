import { Injectable } from '@angular/core';

import { BaseEnvironment } from './base-environment';

declare var window: any;

@Injectable()
export class Config extends BaseEnvironment {
    constructor() {
        super();

        if (undefined !== window.cordova && 'browser' !== window.cordova.platformId) {
            this.contextRoot = 'https://edospnc-api-rct.airfrance.fr/api/';
        }

        this.backEndUrl = `${this.contextRoot}rest/resources`;
        this.versionFileUrl = `${this.contextRoot}version.json`;
        this.env = 'rct';
        this.secmobileEnv = 'rct';
        this.eformsUrl = 'com.airfrance.mobile.inhouse.eformsrctPNC';
        this.eformsCallbackUrl = 'com.airfrance.mobile.inhouse.edospncRCT';

        this.friendlyUrl = 'http://friendly6rct.airfrance.fr';
    }
}
