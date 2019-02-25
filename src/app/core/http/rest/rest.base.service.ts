import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SessionService } from '../../services/session/session.service';
import { Config } from '../../../../environments/config';
import { RestRequest } from './rest-request';

/**
 * Mother class of the RestService App and RestService Web service.
 * We use the same function whether we are in app or web mode.
 * Their behavior change according to the app mode (which is set in app/app.module.model.ts)
 */
Injectable();
export abstract class RestService {

    constructor(
        protected http: HttpClient,
        protected sessionService: SessionService,
        protected config: Config) {
    }

    abstract call(request: RestRequest): Promise<any>;

    get(url: string, jsonData?: any, httpHeaders?: any, byPassImpersonatedUser?: boolean): Promise<any> {
        return this.sendRequest('GET', url, jsonData, httpHeaders, byPassImpersonatedUser);
    }

    post(url: string, jsonData: any, httpHeaders?: any): Promise<any> {
        return this.sendRequest('POST', url, jsonData, httpHeaders);
    }

    put(url: string, jsonData: any, httpHeaders?: any): Promise<any> {
        return this.sendRequest('PUT', url, jsonData, httpHeaders);
    }

    delete(url: string, jsonData?: any, httpHeaders?: any): Promise<any> {
        return this.sendRequest('DELETE', url, jsonData, httpHeaders);
    }

    sendDeferedRequest(request: RestRequest): Promise<any> {
        return this.sendRequest(request.method, request.url, request.jsonData, request.httpHeaders, request.byPassImpersonatedUser);
    }

    sendRequest(method: string, url: string, jsonData: any, httpHeaders?: any, byPassImpersonatedUser?: boolean): Promise<any> {
        const request: RestRequest = new RestRequest();

        request.method = method;
        request.url = url;
        request.jsonData = jsonData;
        request.httpHeaders = httpHeaders;
        request.byPassImpersonatedUser = byPassImpersonatedUser;

        return this.call(request);
    }
}
