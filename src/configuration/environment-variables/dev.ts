import { BaseConfig } from './base';
import { Injectable } from '@angular/core';

@Injectable()
export class Config extends BaseConfig {
    constructor() {
        super();
        this.appVersion = '0';
        this.backEndUrl = '/api/';
        this.env = 'dev';
        this.secmobileEnv = 'rct';
    }
}
