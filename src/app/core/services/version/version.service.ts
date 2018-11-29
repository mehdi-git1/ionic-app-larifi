import { Injectable } from '@angular/core';
import { RestService } from '../../http/rest/rest.base.service';
import { Config } from '../../../../environments/config';

@Injectable()
export class VersionService {

    constructor(public restService: RestService,
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
