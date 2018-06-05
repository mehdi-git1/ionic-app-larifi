import { BaseConfig } from './base';
import { Injectable } from '@angular/core';

@Injectable()
export class Config extends BaseConfig {
    constructor() {
        super();
        this.appVersion = '1';
        this.backEndUrl = '/api/rest/resources';
        this.env = 'default';
        this.secmobileEnv = 'rct';
    }
}
