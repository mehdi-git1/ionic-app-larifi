import { Injectable } from '@angular/core';
import { RestService, RestRequest } from './rest.base.service';
import { SecMobilService } from '../secMobil.service';
import { HttpClient } from '@angular/common/http';



@Injectable()
export class RestMobileService extends RestService {

    constructor(protected http: HttpClient, public secMobilService: SecMobilService) {
        super(http);
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
                }
                request.jsonData = JSON.stringify(request.jsonData);
            }
        }

        return this.secMobilService.call(request);
    }
}
