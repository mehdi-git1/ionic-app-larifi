import { Injectable } from '@angular/core';
import { RestService, RestRequest } from './rest.base.service';
import { RequestOptions, Headers } from '@angular/http';
import { SecMobilService } from './secMobil.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Injectable()
export class RestWebService extends RestService {

    constructor(protected http: HttpClient) {
        super(http);
    }


    public call(request: RestRequest): Promise<any> {
        return new Promise((resolve, reject) => {
            this.makeHttpRequest(request,
                (success) => {
                    resolve(success);
                },
                (err) => {
                    console.error('RestWebService:call failure : ' + err);
                    reject(err);
                });
        });
    }


    private makeHttpRequest(request: RestRequest, successCallback: (result: any) => void, errorCallback: (error: any) => void): void {

        let headers = new HttpHeaders();

        headers.append('Accept', 'application/json, text/plain, */*');

        /////TODO:
        // for (let h of request.httpHeaders) {
        //     headers.append('Content-Type', request.httpHeaders['Content-Type']);
        // }
        // headers.append('secgw_user', 'm328624');
        // headers.append('SN', 'ZngNZu6HZ5julFBEklrR');


        // if (request.httpHeaders['Content-Type'] != undefined)
        //     headers.append('Content-Type', request.httpHeaders['Content-Type']);


        var options = {
            withCredentials: request.withCredential,
            headers: headers
        };

        if (request.method == 'GET') {
            this.http.get(request.url, options).subscribe(
                data => { successCallback(data); },
                err => { errorCallback(err.error); }
            );
        }
        if (request.method == 'POST') {
            this.http.post(request.url, request.jsonData, options).subscribe(
                data => { successCallback(data); },
                err => { errorCallback(err.error); }
            );
        }
        if (request.method == 'PUT') {
            this.http.put(request.url, request.jsonData, options).subscribe(
                data => { successCallback(data); },
                err => { errorCallback(err.error); }
            );
        }
        if (request.method == 'DELETE') {
            this.http.delete(request.url, options).subscribe(
                data => { successCallback(data); },
                err => { errorCallback(err.error); }
            );
        }
    }
}