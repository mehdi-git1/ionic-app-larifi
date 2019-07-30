import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, AlertController } from 'ionic-angular';

import { AppVersionModel } from './../../../../../../core/models/admin/app-version.model';

import { AppVersionListPage } from './../../page/app-version-list/app-version-list.page';
import { AppVersionCreatePage } from '../../page/app-version-create/app-version-create.page';

import { AppVersionAlertService } from './../../../../../../core/services/app-version/app-version-alert.service';
import { ToastService } from './../../../../../../core/services/toast/toast.service';
import { AppVersionService } from './../../../../../../core/services/app-version/app-version.service';

@Component({
  selector: 'app-version',
  templateUrl: 'app-version.component.html'
})
export class AppVersionComponent {

  constructor(
    public navCtrl: NavController,
    private appVersionService: AppVersionService,
    private translateService: TranslateService,
    private alertCtrl: AlertController,
    private toastService: ToastService,
    private appVersionAlertService: AppVersionAlertService) {
  }

  @Input() appVersion: AppVersionModel;


  /**
   *  Présente une alerte pour confirmer la suppression de la version
   * @param appVersion la version à supprimer
   */
  confirmDeleteAppVersion(appVersion: AppVersionModel): void {
    this.alertCtrl.create({
      title: this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.CONFIRM_VERSION_DELETE.TITLE', { 'number': appVersion.number }),
      message: this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.CONFIRM_VERSION_DELETE.MESSAGE', { 'number': appVersion.number }),
      buttons: [
        {
          text: this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.CONFIRM_VERSION_DELETE.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.CONFIRM_VERSION_DELETE.CONFIRM'),
          handler: () => this.delete(appVersion)
        }
      ]
    }).present();
  }

  /**
   * Supprime une version
   * @param appVersion la version à supprimer
   */
  delete(appVersion: AppVersionModel): void {
    this.appVersionService.delete(appVersion.techId).then(success => {
      this.navCtrl.push(AppVersionListPage);
      this.toastService.success(this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.SUCCESS.DELETE_UPDATE_VERSION'));
    }, error => { });
  }

  /**
   * Dirige vers la page de création d'un nouvel objectif
   */
  goToAppVersionUpdate(appVersion: AppVersionModel) {
    this.navCtrl.push(AppVersionCreatePage, { appVersionId: appVersion.techId });
  }

  /**
    * Affiche un aperçu de la version
    * @param appVersion la version dont on souhaite voir l'aperçu
    */
  displayOverview(appVersion: AppVersionModel) {
    this.appVersionAlertService.displayAppVersion(appVersion);
  }
}
