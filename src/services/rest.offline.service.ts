import { Config } from './../configuration/environment-variables/config';
import { Storage } from '@ionic/storage';
import { RestRequest } from './rest.base.service';
import { Injectable } from '@angular/core';

Injectable();
export class OfflineService {

    constructor(public storage: Storage,
        public config: Config) {
    }

    call(request: RestRequest): Promise<any> {
        if (request.method === 'GET') {
            const storageKey: string = this.buildKey(request);
            const promise: Promise<any> = this.storage.get(storageKey);
            if (request.storeOffline) {
                promise.then(result => {
                    this.storage.set(storageKey, result);
                });
            }
            return promise;
        }
    }

    /**
     * Construit la clef utilisée dans IonicStorage à partir de l'uri d'une requête rest
     * @param url l'uri de la requête
     * @return la clef générée
     */
    private buildKey(request: RestRequest): string {
        return `${this.config.appName}${request.method}${request.url}`;
    }

}
