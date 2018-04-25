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
}

export class RestRequest {
    public withCredential: boolean = true;
    public method: string;
    public url: string;
    public httpHeaders;
    public jsonData: any;
}