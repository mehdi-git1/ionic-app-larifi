import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Mother class of the RestService App and RestService Web service.
 * We use the same function whether we are in app or web mode.
 * Their behavior change according to the app mode (which is set in app/app.module.ts)
 */

Injectable();
export abstract class RestService {

    constructor(protected http: HttpClient) {
    }

    abstract call(request: RestRequest): Promise<any>;

    get(url: string, jsonData?: any, httpHeaders?: any, storeOffline?: boolean): Promise<any> {
        return this.sendRequest('GET', url, jsonData, httpHeaders, storeOffline);
    }

    post(url: string, jsonData: any, httpHeaders?: any): Promise<any> {
        return this.sendRequest('POST', url, jsonData, false, httpHeaders);
    }

    put(url: string, jsonData: any, httpHeaders?: any): Promise<any> {
        return this.sendRequest('PUT', url, jsonData, false, httpHeaders);
    }

    delete(url: string, jsonData?: any, httpHeaders?: any): Promise<any> {
        return this.sendRequest('DELETE', url, jsonData, false, httpHeaders);
    }

    sendRequest(method: string, url: string, jsonData: any, httpHeaders?: any, storeOffline?: boolean): Promise<any> {
        const request: RestRequest = new RestRequest();
        request.method = method;
        request.url = url;
        request.jsonData = jsonData;
        request.httpHeaders = httpHeaders;
        request.storeOffline = storeOffline;

        return this.call(request);
    }
}

export class RestRequest {
    public withCredential = true;
    public method: string;
    public url: string;
    public httpHeaders: any;
    public jsonData: any;
    // Défini si on doit stocker le résultat de la requête pour une utilisation offline future
    public storeOffline = false;
}
