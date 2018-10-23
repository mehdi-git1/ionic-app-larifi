import { StatutoryReporting } from './../../models/statutoryReporting/statutory-reporting';
import { Config } from './../../configuration/environment-variables/config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class OnlineStatutoryReportingProvider {

    constructor(public restService: RestService,
        public config: Config) {
    }

    /**
     * Récupère le suivi réglementaire d'un PNC
     * @param matricule le matricule du PNC dont on souhaite récupérer le suivi réglementaire
     * @return le suivi réglementaire du PNC
     */
    getStatutoryReporting(matricule: string): Promise<StatutoryReporting> {
        // return this.restService.get(`${this.config.backEndUrl}/statutory_reporting/${matricule}`);
        return new Promise((resolve, reject) => {
            const statutoryReporting = new StatutoryReporting();
            // statutoryReporting.stagesList = [{ date: new Date(), code: 'FPX', label: 'Formation CCP', result: '-' },
            // { date: new Date(), code: 'FPX', label: 'Formation CCP', result: '-' },
            // { date: new Date(), code: 'FPX', label: 'Formation CCP', result: '-' }];
            resolve(statutoryReporting);
        });
    }
}
