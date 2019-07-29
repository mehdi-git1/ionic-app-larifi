import { AppVersionModel } from './../../../../../../core/models/admin/app-version.model';
import { AppVersionService } from './../../../../../../core/services/app-version/app-version.service';
import { AppVersionCreatePage } from './../app-version-create/app-version-create.page';
import { TabHeaderModeEnum } from './../../../../../../core/enums/tab-header-mode.enum';
import { TabHeaderEnum } from '../../../../../../core/enums/tab-header.enum';

import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../../../core/services/toast/toast.service';

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
    private navCtrl: NavController,
    private translateService: TranslateService,
    private alertCtrl: AlertController,
    private toastService: ToastService) {
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
