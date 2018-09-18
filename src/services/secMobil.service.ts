import { isUndefined } from 'ionic-angular/util/util';
import { DeviceService } from './device.service';
import { Injectable } from '@angular/core';
import { Config } from '../configuration/environment-variables/config';
import { Platform, Events } from 'ionic-angular';
import { RestRequest } from './rest.base.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastProvider } from '../providers/toast/toast';
import { ConnectivityService } from './connectivity.service';

declare var window: any;

@Injectable()
export class SecMobilService {

    constructor(public config: Config,
        private events: Events,
        public platform: Platform,
        private deviceService: DeviceService,
        private translateService: TranslateService,
        private toastProvider: ToastProvider) {
    }

    public init() {
        if (this.secMobile) {
            this.secMobile.initSecmobilHttp(this.config.secmobileEnv);
            console.log('init plugin with ' + this.config.secmobileEnv + ' env');
            this.secMobile.secMobilSetAppGroup('AF_GROUP');
        }
    }

    get secMobile(): any {
        if (!this.deviceService.isBrowser() && window.cordova.plugins && window.cordova.plugins.CertAuthPlugin) {
            return window.cordova.plugins.CertAuthPlugin;
        } else {
            return null;
        }
    }

    public secMobilRevokeCertificate(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.secMobile) {
                this.secMobile.secMobilRevokeCertificate('',
                    (success) => {
                        resolve(success);
                    },
                    (err) => {
                        console.error('AuthentService:secMobilRevokeCertificate failure : ' + err);
                        reject(err);
                    }
                );
            } else {
                // console.debug('Not in mobile mode');
                resolve('ok');
            }
        });
    }

    /**
     * Authenticate 'login' user.
     */
    public authenticate(login: string, password: string): Promise<any> {
        const authentParam = {
            'duration': 'long',
            'userId': login.toLowerCase(),
            'strongPassword': password
        };
        return new Promise((resolve, reject) => {
            if (this.secMobile) {
                this.secMobile.secMobilGetCertificate(authentParam,
                    (success) => {
                        resolve(success);
                    },
                    (err) => {
                        console.error('isAuthenticated:authenticate failure : ' + err);
                        reject(err);
                    }
                );
            } else {
                // console.debug('Not in Mobile Mode');
                resolve('ok');
            }
        });
    }

    /**
     * Check if certificate is present and valid.
     */
    public isAuthenticated(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.secMobile) {
                this.secMobile.secMobilHasCertificate('',
                    (success) => {
                        console.log('certificate present');
                        resolve('ok');
                    },
                    (err) => {

                        console.log('NO certificate present');
                        console.error('isAuthenticated:isAuthenticated failure : ' + err);
                        reject(err);
                    }
                );
            } else {
                resolve('ok');
            }
        }
        );
    }

    /**
    * Make http request
    */
    public call(request: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.handleGetRequest(request);
            this.secMobile.secMobilCallRestService(request,
                (success) => {
                    try {
                        resolve(JSON.parse(success));
                    } catch (error) {
                        console.error('fail : ' + error);
                        console.log(JSON.stringify(success));
                        // en cas d objet json vide, en renvois null, et ça implique qu'on peut recevoir du back que du json
                        resolve(null);
                    }
                },
                (err) => {
                    console.error('secmobile call failure sur la requete ' + request.url + ' : ' + err);
                    // Pour certains appels, il n'est pas nécessaire d'afficher le toast d'error ou de tracer l'erreur
                    if (!request.url.includes('/api/rest/resources/ping')) {
                        this.secMobile.secMobilCallRestService(this.getPingRequest(),
                            (success) => {

                                let errorMessage = this.translateService.instant('GLOBAL.UNKNOWN_ERROR');
                                if (err && err.error && !isUndefined(err.error.detailMessage) && err.error.label === 'BUSINESS_ERROR') {
                                    errorMessage = err.error.detailMessage;
                                }
                                this.toastProvider.error(errorMessage);
                            }, error => {
                                // TODO : tenter de relancer l'appel en offline
                                this.events.publish('connectionStatus:disconnected');
                            });
                    }
                    reject(err);
                });
        });
    }

    /**
     * construie et renvoie la requete du ping
     */
    getPingRequest() {
        const request: RestRequest = new RestRequest();
        request.method = 'GET';
        request.url = this.config.pingUrl;
        return request;
    }

    /**
     * Ajoute les données envoyé dans le jsonData dans l'URI de la requête.
     * @param request
     */
    handleGetRequest(request: RestRequest) {
        // SecMobile crash lorsqu'on lui passe une requête GET avec un body,
        // on doit donc ajouter les éléments du body dans l'uri avant
        if (request.method === 'GET' && request.jsonData !== undefined) {
            request.url = `${request.url}?${this.jsonToQueryString(request.jsonData)}`;
            request.jsonData = undefined;
        }
    }

    /**
     * Tranforme un json en string représentant les parametres de requête.
     * @param json
     */
    jsonToQueryString(json) {
        return Object.keys(json).map(function (key) {
            return key + '=' + json[key];
        }).join('&');
    }
}
