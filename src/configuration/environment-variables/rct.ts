import { BaseConfig } from './base';
import { Injectable } from '@angular/core';

@Injectable()
export class Config extends BaseConfig {
    constructor() {
        super();
        this.appVersion = '1';
        this.backEndUrl = '/api/some/other/one';
        this.env = 'rct';
        this.secmobileEnv = 'rct';
    }
}
