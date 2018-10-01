import { SessionService } from './session.service';
import { Injectable } from '@angular/core';
import { RestService, RestRequest } from './rest.base.service';
import { SecMobilService } from './secMobil.service';
import { HttpClient } from '@angular/common/http';



@Injectable()
export class RestMobileService extends RestService {

    constructor(protected http: HttpClient, public secMobilService: SecMobilService, protected sessionService: SessionService) {
        super(http, sessionService);
    }

    public call(request: RestRequest): Promise<any> {

        if (request.method == 'POST' || request.method == 'PUT') {
            if (request.jsonData) {
                if (!request.httpHeaders) {
                    // En mode mobile, on construit un objet JS classique, attendu par secMobile
                    request.httpHeaders = {
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    };
                    // On ajoute un header spécial si la fonction d'impersonnification a été utilisée
                    if (this.sessionService.impersonatedPnc && this.sessionService.impersonatedPnc.matricule) {
                        request.httpHeaders.IMPERSONATE = this.sessionService.impersonatedPnc.matricule;
                    }
                }
                request.jsonData = JSON.stringify(request.jsonData);
            }
        }

        return this.secMobilService.call(request);
    }
}
