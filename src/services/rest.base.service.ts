import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Mother class of the RestService App and RestService Web service.
 * We use the same function whether we are in app or web mode.
 * Their behavior change according to the app mode (which is set in app/app.module.ts)
 */

export class RestRequest {
  public withCredential = true;
  public method: string;
  public url: string;
  public httpHeaders: any;
  public jsonData: any;
}

Injectable();
export abstract class RestService {

    constructor(protected http: HttpClient) {
    }

    abstract call(request: RestRequest): Promise<any>;

    get(url: string, jsonData?: any, httpHeaders?: any): Promise<any> {
        return this.sendRequest('GET', url, jsonData, httpHeaders);
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

    sendRequest(method: string, url: string, jsonData: any, httpHeaders?: any): Promise<any> {
        const request: RestRequest = new RestRequest();
        request.method = method;
        request.url = url;
        request.jsonData = jsonData;
        request.httpHeaders = httpHeaders;

        return this.call(request);
    }
}

