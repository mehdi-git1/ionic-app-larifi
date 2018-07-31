import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/**
 * Mother class of the RestService App and RestService Web service.
 * We use the same function whether we are in app or web mode.
 * Their behavior change according to the app mode (which is set in app/app.module.ts)
 */

export class RestRequest {
  public withCredential = true;
  public method: string;
  public url: string;
  public options: any;
  public jsonData: any;
}

Injectable();
export abstract class RestService {

  constructor(protected http: HttpClient) {
  }

  abstract call(request: RestRequest): Promise<any>;

  get(url: string, jsonData?: any, options?: any): Promise<any> {
    return this.sendRequest('GET', url, jsonData, options);
  }

  post(url: string, jsonData: any, options?: any): Promise<any> {
    let data: string;
    if (jsonData) {
      data = JSON.stringify(jsonData);
    }
    return this.sendRequest('POST', url, data, options);
  }

  put(url: string, jsonData: any, options?: any): Promise<any> {
    return this.sendRequest('PUT', url, jsonData, options);
  }

  delete(url: string, jsonData?: any, options?: any): Promise<any> {
    return this.sendRequest('DELETE', url, jsonData, options);
  }

  sendRequest(method: string, url: string, jsonData: any, options?: any): Promise<any> {
    const request: RestRequest = new RestRequest();

    if (!options) {
      options = {};
    }

    if (!options.headers) {
      options.headers = new HttpHeaders();
    }

    request.method = method;
    request.url = url;
    request.jsonData = jsonData;
    request.options = options;


    return this.call(request);
  }
}
