import { BaseConfig } from './base';
import { Injectable } from '@angular/core';

@Injectable()
export class Config extends BaseConfig {
    constructor() {
        super();
        this.appVersion = '0';
        this.backEndUrl = '/api/rest/resources';
        this.env = 'dev';
        this.secmobileEnv = 'rct';
        this.eObsUrl = 'com.airfrance.mobile.inhouse.eformsdevPNC';
        this.eObscallbackUrl = 'com.airfrance.mobile.inhouse.EDosPNC';
    }
}
