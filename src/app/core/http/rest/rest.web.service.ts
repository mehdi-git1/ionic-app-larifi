import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Config } from '../../../../environments/config';
import { SessionService } from '../../services/session/session.service';
import { RestRequest } from './rest-request';
import { RestService } from './rest.base.service';

@Injectable({ providedIn: 'root' })
export class RestWebService extends RestService {

  constructor(
    protected http: HttpClient,
    protected config: Config,
    protected sessionService: SessionService) {
    super(http, sessionService, config);
  }

  public call(request: RestRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      this.makeHttpRequest(request,
        (success) => {
          resolve(success);
        },
        (error) => {
          console.error('HttpRequest failure', error);
          reject(error);
        });
    });
  }

  private makeHttpRequest(request: RestRequest, successCallback: (result: any) => void, errorCallback: (error: any) => void): void {

    if (!request.httpHeaders) {
      request.httpHeaders = {};
    }
    if (!request.httpHeaders.headers) {
      request.httpHeaders.headers = new HttpHeaders();
    }

    // Ajout de la version de l'application dans chaque requête
    request.httpHeaders.headers = request.httpHeaders.headers.append('APP_VERSION', this.config.appVersion);


    // Dans les environnements en mode full ping, cette valeur n'est pas écrasée, car le SM_USER n'est plus ajouté par habile.
    // En local, il sert néamoins à simuler l'authentification habile.
    // Il faut s'assurer que le matricule, renseigné au format short est présent dans la rubrique <SimulationSection> du fichier habile-filter-config.xml
    if (this.config.isLocalhost()) {
      request.httpHeaders.headers = request.httpHeaders.headers.append('SM_USER', 't595474');
    }

    // On ajoute un header spécial si la fonction d'impersonnification a été utilisée
    if (!request.byPassImpersonatedUser && this.sessionService.impersonatedUser && this.sessionService.impersonatedUser.matricule) {
      request.httpHeaders.headers = request.httpHeaders.headers.append('IMPERSONATE', this.sessionService.impersonatedUser.matricule);
    }

    // On ajoute un header spécial si la requête doit outrepasser l'intercepteur
    if (request.byPassInterceptor) {
      request.httpHeaders.headers = request.httpHeaders.headers.append('BYPASS_INTERCEPTOR', 'true');
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

