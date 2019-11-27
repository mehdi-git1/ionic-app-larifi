import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AppVersionModel } from '../../../../../../core/models/admin/app-version.model';
import {
    AppVersionAlertService
} from '../../../../../../core/services/app-version/app-version-alert.service';
import { AppVersionService } from '../../../../../../core/services/app-version/app-version.service';
import { ToastService } from '../../../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-version',
  templateUrl: 'app-version.component.html',
  styleUrls: ['./app-version.component.scss']
})
export class AppVersionComponent {

  constructor(
    private router: Router,
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
      header: this.translateService
        .instant('ADMIN.APP_VERSION_MANAGEMENT.CONFIRM_VERSION_DELETE.TITLE', { number: appVersion.number }),
      message: this.translateService
        .instant('ADMIN.APP_VERSION_MANAGEMENT.CONFIRM_VERSION_DELETE.MESSAGE', { number: appVersion.number }),
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
    }).then(alert => alert.present());
  }

  /**
   * Supprime une version
   * @param appVersion la version à supprimer
   */
  delete(appVersion: AppVersionModel): void {
    this.appVersionService.delete(appVersion.techId).then(success => {
      this.router.navigate(['admin', 'app-version', 'list']);
      this.toastService.success(this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.SUCCESS.DELETE_UPDATE_VERSION'));
    }, error => { });
  }

  /**
   * Dirige vers la page de création d'un nouvel objectif
   */
  goToAppVersionUpdate(appVersion: AppVersionModel) {
    this.router.navigate(['admin', 'app-version', 'create', appVersion.techId]);
  }

  /**
   * Affiche un aperçu de la version
   * @param appVersion la version dont on souhaite voir l'aperçu
   */
  displayOverview(appVersion: AppVersionModel) {
    this.appVersionAlertService.displayAppVersion(appVersion);
  }
}
