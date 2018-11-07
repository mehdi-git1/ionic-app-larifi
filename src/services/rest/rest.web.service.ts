import { Config } from '../../configuration/environment-variables/config';
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

        if (!request.httpHeaders) {
            // Creation en mode javascript pour passer le secmobil qui ne prends pas en compte les "objets"
            request.httpHeaders = {};
        }
        if (!request.httpHeaders.headers) {
            request.httpHeaders.headers = new HttpHeaders();
        }

        // En local, on ajoute le header SM_USER pour simuler l'authent habile
        if (this.config.isLocalhost()) {
            request.httpHeaders.headers = request.httpHeaders.headers.append('SM_USER', 'm077557');
        }

        request.httpHeaders.headers = request.httpHeaders.headers.append('Accept', 'application/json, text/plain, */*');
        request.httpHeaders.withCredentials = request.withCredential;

        if (request.method === 'GET') {
            request.httpHeaders.params = request.jsonData;
            this.http.get(request.url, request.httpHeaders).subscribe(
                data => { successCallback(data); },
                err => { errorCallback(err.error); }
            );
        }
        if (request.method === 'POST') {
            this.http.post(request.url, request.jsonData, request.httpHeaders).subscribe(
                data => { successCallback(data); },
                err => { errorCallback(err.error); }
            );
        }
        if (request.method === 'PUT') {
            this.http.put(request.url, request.jsonData, request.httpHeaders).subscribe(
                data => { successCallback(data); },
                err => { errorCallback(err.error); }
            );
        }
        if (request.method === 'DELETE') {
            this.http.delete(request.url, request.httpHeaders).subscribe(
                data => { successCallback(data); },
                err => { errorCallback(err.error); }
            );
        }
    }
}

