import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { Config } from '../../../environments/config';
import { Utils } from '../../shared/utils/utils';
import { UrlConfiguration } from '../configuration/url.configuration';
import { DeviceService } from '../services/device/device.service';
import { Events } from '../services/events/events.service';
import { ToastService } from '../services/toast/toast.service';
import { RestRequest } from './rest/rest-request';

declare var window: any;

@Injectable({ providedIn: 'root' })
export class SecMobilService {

    private PLUGIN_INITIALIZED = false;
    constructor(
        public config: Config,
        public urlConfiguration: UrlConfiguration,
        private events: Events,
        public platform: Platform,
        private deviceService: DeviceService,
        private translateService: TranslateService,
        private toastProvider: ToastService) {
    }

    public init() {
        if (this.secMobile && !this.PLUGIN_INITIALIZED) {
            const secMobilInitParameters = {
                environment: this.config.secmobileEnv,
                company: 'AF_GROUP'
            };
            this.secMobile.initSecmobilHttp(secMobilInitParameters, (success => {
                this.PLUGIN_INITIALIZED = true;
            }));
            console.log('init plugin with ' + this.config.secmobileEnv + ' env');
        } else {
            console.log('plugin already initialized');
        }
    }

    get secMobile(): any {
        if (!this.deviceService.isBrowser() && window.cordova.plugins && window.cordova.plugins.CertAuthPlugin) {
            return window.cordova.plugins.CertAuthPlugin;
        } else {
            return null;
        }
    }

    /**
     * Lance l'application SUA
     */
    openSUA() {
        if (this.secMobile) {
            const openParams = {
                appName: this.config.appName,
                returnScheme: this.config.appScheme,
                shouldExtendConnection: true
            }
            return new Promise((resolve, reject) => {
                this.secMobile.secMobilOpenSecMobileAppWithParam(openParams,
                    (success) => {
                        resolve(success);
                    },
                    (err) => {
                        reject(err);
                    })
            });

        }

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
                        return success;
                    } catch (error) {
                        console.error('fail : ' + error);
                        // en cas d objet json vide, on renvoie null, et ça implique qu'on peut recevoir du back que du json
                        resolve(null);
                    }
                },
                (err) => {
                    console.error('secmobile call failure sur la requete ' + request.url + ' : ' + err);
                    const isCertificateAbsent = (err === "secmobil.nocertificate");
                    // Pour certains appels, il n'est pas nécessaire d'afficher le toast d'error ou de tracer l'erreur
                    if (!request.url.includes(this.urlConfiguration.getBackEndUrl('getPing')) && !isCertificateAbsent) {
                        this.secMobile.secMobilCallRestService(this.getPingRequest(),
                            (success) => {
                                if (!request.byPassInterceptor) {
                                    let errorMessage = this.translateService.instant('GLOBAL.UNKNOWN_ERROR');
                                    err = Utils.fromStringToObject(err);
                                    if (err && err.detailMessage !== undefined && err.label === 'BUSINESS_ERROR') {
                                        errorMessage = err.detailMessage;
                                    }
                                    this.toastProvider.error(errorMessage, 10000);
                                }
                            }, (error) => {
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
        request.url = this.urlConfiguration.getBackEndUrl('getPing');
        return request;
    }

    /**
     * Ajoute les données envoyé dans le jsonData dans l'URI de la requête.
     * @param request la requête à envoyer
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
     * @param json le json à transformer
     */
    jsonToQueryString(json) {
        return Object.keys(json).map((key) => {
            return key + '=' + json[key];
        }).join('&');
    }

}
