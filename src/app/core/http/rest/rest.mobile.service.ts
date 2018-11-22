import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SessionService } from '../../services/session/session.service';
import { RestService, RestRequest } from './rest.base.service';
import { SecMobilService } from '../secMobil.service';
import { Config } from '../../../../configuration/environment-variables/config';



@Injectable()
export class RestMobileService extends RestService {

    constructor(protected http: HttpClient, public secMobilService: SecMobilService, protected config: Config, protected sessionService: SessionService) {
        super(http, sessionService, config);
    }

    public call(request: RestRequest): Promise<any> {
        // On ajoute un header spécial si la fonction d'impersonnification a été utilisée
        if (!request.byPassImpersonatedUser && this.sessionService.impersonatedUser && this.sessionService.impersonatedUser.matricule) {
            request.httpHeaders = {
                'IMPERSONATE': this.sessionService.impersonatedUser.matricule
            };
        }
        if (request.method == 'POST' || request.method == 'PUT') {
            if (request.jsonData) {
                const defaultHeader = {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                };
                request.httpHeaders = !request.httpHeaders ? defaultHeader : Object.assign(request.httpHeaders, defaultHeader);
                // En mode mobile, on construit un objet JS classique, attendu par secMobile
                request.jsonData = JSON.stringify(request.jsonData);
            }
        }

        return this.secMobilService.call(request);
    }
}
