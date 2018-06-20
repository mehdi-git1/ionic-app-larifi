import { DatePipe } from '@angular/common';
import { Config } from './../configuration/environment-variables/config';
import { Storage } from '@ionic/storage';
import { RestRequest } from './rest.base.service';
import { Injectable } from '@angular/core';
import { EDossierPncObject } from '../models/eDossierPncObject';

@Injectable()
export class OfflineService {

    constructor(private storage: Storage,
        private config: Config,
        private datePipe: DatePipe) {
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
        if (Array.isArray(data)) {
            for (const eDossierPncObject of data) {
                this.completeOfflineData(eDossierPncObject);
            }
        } else {
            this.completeOfflineData(data);
        }
        this.storage.set(this.buildKey(request), data);
    }

    /**
     * Complète les données offline d'un objet avant qu'il soit sauvegardé dans le stockage local
     * @param eDossierPncObject l'objet à compléter
     */
    completeOfflineData(eDossierPncObject: EDossierPncObject) {
        eDossierPncObject.offlineStorageDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
        eDossierPncObject.availableOffline = true;
    }

    /**
     * Marque les données comme dispo hors ligne si ces dernières sont en cache
     * @param restRequest la requête envoyée au serveur
     * @param data la réponse obtenue du serveur
     */
    flagDataAsAvailableOffline(restRequest: RestRequest, serverData: any) {
        this.call(restRequest).then(offlineData => {
            if (offlineData !== null) {
                if (Array.isArray(offlineData)) {
                    this.flagEDossierPncObjectArrayAsAvailableOffline(offlineData, serverData);
                } else {
                    this.flagEDossierPncObjectAsAvailableOffline(serverData);
                }
            }
        });
    }

    /**
     * Marque l'objet EdossierPnc comme dispo offline
     * @param eDossierPncObject l'objet à marquer
     */
    private flagEDossierPncObjectAsAvailableOffline(eDossierPncObject: EDossierPncObject) {
        eDossierPncObject.availableOffline = true;
    }

    /**
     * Marque les données comme dispo en hors connexion si celle ci sont retrouvées dans le stockage local de l'appli
     * @param offlineDataArray le tableau contenant les données retrouvées en local
     * @param serverDataArray le tableau contenant les données retournées par le serveur
     */
    private flagEDossierPncObjectArrayAsAvailableOffline(offlineDataArray: EDossierPncObject[], serverDataArray: EDossierPncObject[]) {
        for (const serverData of serverDataArray) {
            for (const offlineData of offlineDataArray) {
                if (offlineData.techId === serverData.techId) {
                    this.flagEDossierPncObjectAsAvailableOffline(serverData);
                }
            }
        }
    }

}
