import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Config } from '../../../../environments/config';
import { SessionService } from '../../services/session/session.service';
import { SecMobilService } from '../secMobil.service';
import { RestRequest } from './rest-request';
import { RestService } from './rest.base.service';

@Injectable({ providedIn: 'root' })
export class RestMobileService extends RestService {

    constructor(
        protected http: HttpClient,
        public secMobilService: SecMobilService,
        protected config: Config,
        protected sessionService: SessionService) {
        super(http, sessionService, config);
    }

    public call(request: RestRequest): Promise<any> {
        request.httpHeaders = {
            'APP_VERSION': this.config.appVersion
        };

        // On ajoute un header spécial si la fonction d'impersonnification a été utilisée
        if (!request.byPassImpersonatedUser && this.sessionService.impersonatedUser && this.sessionService.impersonatedUser.matricule) {
            request.httpHeaders = Object.assign(request.httpHeaders, {
                'IMPERSONATE': this.sessionService.impersonatedUser.matricule
            });
        }

        // On ajoute un header spécial si la requête doit outrepasser l'intercepteur
        if (request.byPassInterceptor) {
            request.httpHeaders = Object.assign(request.httpHeaders, {
                'BYPASS_INTERCEPTOR': 'true'
            });
        }

        if ((request.method == 'POST' || request.method == 'PUT') && request.jsonData) {
            request.httpHeaders = Object.assign(request.httpHeaders, {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            });

            // En mode mobile, on construit un objet JS classique, attendu par secMobile
            request.jsonData = JSON.stringify(request.jsonData);
        }

        return this.secMobilService.call(request);
    }
}
