import { BaseConfig } from './base';
import { Injectable } from '@angular/core';

@Injectable()
export class Config extends BaseConfig {
    constructor() {
        super();
        this.appVersion = '1';
        this.backEndUrl = '/api/other/url';
        this.env = 'prod';
        this.secmobileEnv = 'prd';
    }
}