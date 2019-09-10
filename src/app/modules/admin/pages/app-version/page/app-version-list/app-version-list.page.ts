import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TabHeaderModeEnum } from './../../../../../../core/enums/tab-header-mode.enum';
import { TabHeaderEnum } from '../../../../../../core/enums/tab-header.enum';

import { AppVersionModel } from './../../../../../../core/models/admin/app-version.model';

import { AppVersionCreatePage } from './../app-version-create/app-version-create.page';

import { AppVersionService } from './../../../../../../core/services/app-version/app-version.service';

@Component({
  selector: 'page-app-version-list',
  templateUrl: 'app-version-list.page.html',
})
export class AppVersionListPage {

  TabHeaderModeEnum = TabHeaderModeEnum;
  TabHeaderEnum = TabHeaderEnum;

  appVersions: AppVersionModel[];

  constructor(
    private appVersionService: AppVersionService,
    private navCtrl: NavController) {
  }

  ionViewDidEnter() {
    this.initAppVersionsList();

  }

  /**
    * Récupère la liste des objectifs
    */
  initAppVersionsList() {
    this.appVersionService.getAllAppVersions().then(appVersions => {
      this.appVersions = appVersions;
    }, error => { });
  }


  /**
   * Dirige vers la page de création d'un nouvel objectif
   */
  goToAppVersionCreation() {
    this.navCtrl.push(AppVersionCreatePage, { AppVersionNumber: 0 });
  }

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return this.appVersions !== undefined;
  }
}
