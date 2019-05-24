import { Component } from '@angular/core';

import { AppVersionModel } from './../../../../core/models/admin/app-version.model';

import { AppVersionService } from './../../../../core/services/app-version/app-version.service';

@Component({
    selector: 'page-app-version-history',
    templateUrl: 'app-version-history.page.html',
})
export class AppVersionHistoryPage {

    appVersions: AppVersionModel[];

    selectedAppVersion: AppVersionModel;

    constructor(private appVersionService: AppVersionService) { }

    ionViewDidEnter() {
        this.initPage();
    }

    /**
     * Initialise la page
     */
    initPage() {
        this.appVersionService.getAllAppVersions().then(appVersions => {
            this.appVersions = appVersions;
        }, error => { });
    }

    /**
     * Vérifie si le chargement des données nécessaires à l'affichage de la page est terminé
     * @return vrai si c'est le cas, faux sinon
     */
    isLoadingOver(): boolean {
        return this.appVersions !== undefined;
    }

    /**
     * Ouvre la version pour permettre sa visualisation
     * @param appVersion la version à visualiser
     */
    editAppVersion(appVersion: AppVersionModel) {
        this.selectedAppVersion = appVersion;
        console.log(this.selectedAppVersion);
    }

    /**
     * Vérifie si une version est sélectionnée pour la visualisation
     * @param appVersion la version à tester
     * @return vrai si la version est sélectionnée, faux sinon
     */
    isAppVersionSelected(appVersion: AppVersionModel): boolean {
        return this.selectedAppVersion && this.selectedAppVersion.number === appVersion.number;
    }

}
