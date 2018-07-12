import { Config } from './../configuration/environment-variables/config';
import { Injectable } from '@angular/core';
import { RestService, RestRequest } from './rest.base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Injectable()
export class RestWebService extends RestService {

    constructor(protected http: HttpClient, private config: Config) {
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


        // En local, on ajoute le header SM_USER pour simuler l'authent habile
        if (this.config.isLocalhost()) {
            request.options.headers = request.options.headers.append('SM_USER', 'm077557');
        }

        request.options.headers = request.options.headers.append('Accept', 'application/json, text/plain, */*');

        ///// TODO:
        // for (const h of request.httpHeaders) {
        //     headers.append('Content-Type', h);
        // }
        //   headers.append('sm_user', '07339967');
        // headers.append('secgw_user', 'm328624');
        // headers.append('SN', 'ZngNZu6HZ5julFBEklrR');

        // if (request.httpHeaders['Content-Type'] != undefined)
        //     headers.append('Content-Type', request.httpHeaders['Content-Type']);

        request.options.withCredentials = request.withCredential;

        if (request.method === 'GET') {
            this.http.get(request.url, request.options).subscribe(
                data => { successCallback(data); },
                err => { errorCallback(err.error); }
            );
        }
        if (request.method === 'POST') {
            this.http.post(request.url, request.jsonData, request.options).subscribe(
                data => { successCallback(data); },
                err => { errorCallback(err.error); }
            );
        }
        if (request.method === 'PUT') {
            this.http.put(request.url, request.jsonData, request.options).subscribe(
                data => { successCallback(data); },
                err => { errorCallback(err.error); }
            );
        }
        if (request.method === 'DELETE') {
            this.http.delete(request.url, request.options).subscribe(
                data => { successCallback(data); },
                err => { errorCallback(err.error); }
            );
        }
    }
}
