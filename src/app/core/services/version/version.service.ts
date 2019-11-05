import { Injectable } from '@angular/core';

import { Config } from '../../../../environments/config';
import { RestService } from '../../http/rest/rest.base.service';

@Injectable({ providedIn: 'root' })
export class VersionService {

    constructor(
        private restService: RestService,
        private config: Config) {
    }

    /**
     * Récupère le numéro de version du back
     * @return le numéro de version du back
     */
    getBackVersion(): Promise<string> {
        return this.restService.get(this.config.versionFileUrl);
    }
}
