import { Injectable } from '@angular/core';
import { RestService } from '../../http/rest/rest.base.service';
import { AppVersionModel } from '../../models/admin/app-version.model';
import { UrlConfiguration } from '../../configuration/url.configuration';

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
     * Crée une version
     * @param appVersion la version à créer
     * @return la version créé
     */
    public createAppVersion(appVersion: AppVersionModel): Promise<AppVersionModel> {
        return this.restService.post(this.config.getBackEndUrl('createAppVersion'), appVersion);
    }
}
