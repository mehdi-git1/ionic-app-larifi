import { Component } from '@angular/core';

import { TextEditorModeEnum } from '../../../../core/enums/text-editor-mode.enum';
import { AppVersionModel } from '../../../../core/models/admin/app-version.model';
import { AppVersionService } from '../../../../core/services/app-version/app-version.service';

@Component({
  selector: 'page-app-version-history',
  templateUrl: 'app-version-history.page.html',
  styleUrls: ['./app-version-history.page.scss']
})
export class AppVersionHistoryPage {

  appVersions: AppVersionModel[];

  selectedAppVersion: AppVersionModel;

  TextEditorModeEnum = TextEditorModeEnum;

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
   * Retourne le statut de la version
   * @param appVersion la version pour laquelle on souhaite avoir l'état
   * @returns le statut de la version
   */
  isDeprecated(appVersion: AppVersionModel): boolean {
    return appVersion.deprecated;
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
