import { Injectable } from '@angular/core';

import { BaseEnvironment } from './base-environment';

declare var window: any;

@Injectable({ providedIn: 'root' })
export class Config extends BaseEnvironment {
    constructor() {
        super();

        if (undefined !== window.cordova && 'browser' !== window.cordova.platformId) {
            this.contextRoot = 'https://edospnc-api-fix-rct.airfrance.fr/api/';
        }

        this.backEndUrl = `${this.contextRoot}rest/resources`;
        this.versionFileUrl = `${this.contextRoot}version.json`;
        this.env = 'rct2';
        this.secmobileEnv = 'rct';
        this.eformsUrl = 'com.airfrance.mobile.inhouse.eformsrctPNC';
        this.eformsCallbackUrl = 'com.airfrance.mobile.inhouse.edospncRCT2';

        this.friendlyUrl = 'http://friendly6rct.airfrance.fr';
    }
}
