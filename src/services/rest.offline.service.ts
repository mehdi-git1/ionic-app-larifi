import { Config } from './../configuration/environment-variables/config';
import { Storage } from '@ionic/storage';
import { RestRequest } from './rest.base.service';
import { Injectable } from '@angular/core';

@Injectable()
export class OfflineService {

    constructor(public storage: Storage,
        public config: Config) {
    }

    call(request: RestRequest): Promise<any> {
        if (request.method === 'GET') {
            return this.storage.get(this.buildKey(request));
        }
    }

    /**
     * Construit la clef utilisée dans IonicStorage à partir de l'uri d'une requête rest
     * @param url l'uri de la requête
     * @return la clef générée
     */
    public buildKey(request: RestRequest): string {
        return `${this.config.appName}${request.method}${request.url}`;
    }

    /**
     * Sauvegarde dans le stockage local une donnée
     * @param request la requête rest
     * @param data la donnée à sauver
     */
    public saveRestResponse(request: RestRequest, data: any) {
        this.storage.set(this.buildKey(request), data);
    }

}
