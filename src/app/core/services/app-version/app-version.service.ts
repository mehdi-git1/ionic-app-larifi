import { Injectable } from '@angular/core';

import { UrlConfiguration } from '../../configuration/url.configuration';

import { AppVersionModel } from '../../models/admin/app-version.model';

import { RestService } from '../../http/rest/rest.base.service';

@Injectable()
export class AppVersionService {

    constructor(private restService: RestService,
        private config: UrlConfiguration) {
    }

    /**
     * Récupère la liste des versions de l'application de la plus récente à la plus ancienne
     * @return la liste de toutes les versions de l'application de la plus récente à la plus ancienne
     */
    public getAllAppVersions(): Promise<AppVersionModel[]> {
        return this.restService.get(this.config.getBackEndUrl('getAllAppVersions'));
    }

    /**
     * Crée ou met à jour une version
     * @param appVersion la version à créer ou à mettre à jour
     * @return la version créée ou mise à jour
     */
    public createOrUpdateAppVersion(appVersion: AppVersionModel): Promise<AppVersionModel> {
        return this.restService.post(this.config.getBackEndUrl('appVersions'), appVersion);
    }

    /**
     * Supprime une version
     * @param id l'id de la version à supprimer
     * @return une promesse qui se résout quand la suppression est faite
     */
    delete(id: number): Promise<void> {
        return this.restService.delete(this.config.getBackEndUrl('deleteAppVersionById', [id]));
    }
}
