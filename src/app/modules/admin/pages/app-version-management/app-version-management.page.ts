import { AppVersionModel } from './../../../../core/models/admin/app-version.model';
import { AppVersionService } from './../../../../core/services/app-version/app-version.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'page-app-version-management',
    templateUrl: 'app-version-management.page.html',
})
export class AppVersionManagementPage {

    matPanelHeaderHeight = '41px';
    number: string;
    changelog: string;

    regEx = /([0-9]{1,2}[.]){2}[0-9]{1,2}/;

    allAppVersions: AppVersionModel[];
    appVersion: AppVersionModel;

    constructor(private appVersionService: AppVersionService,
        private translateService: TranslateService,
        private alertCtrl: AlertController,
        private toastService: ToastService) {
    }

    ionViewDidEnter() {
        this.appVersionService.getAllAppVersions().then(allAppVersions => {
            this.allAppVersions = allAppVersions;
        }, error => { });
    }

    /**
     * Crée ou mis a jour une Version
     * @param appVersion la version concernée
     */
    createOrUpdateAppVersion(appVersion: AppVersionModel): void {
        if (appVersion == null) {
            this.appVersion = new AppVersionModel();
            this.appVersion.number = this.number;
            this.appVersion.changelog = this.changelog;
        } else {
            this.appVersion = appVersion;
        }
        if (!this.regEx.test(this.appVersion.number)) {
            return this.toastService.error(this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.ERROR.UNDEFINED_NUMBER'));
        }
        this.appVersionService
            .createOrUpdateAppVersion(this.appVersion)
            .then(success => {
                this.appVersionService.getAllAppVersions().then(allAppVersions => {
                    this.allAppVersions = allAppVersions;
                }, error => { });
                this.toastService.success(this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.SUCCESS.CREATEORUPDATE_VERSION'));
            }, error => { });
    }

    /**
    * Présente une alerte pour confirmer la suppression du brouillon
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
            this.appVersionService.getAllAppVersions().then(allAppVersions => {
                this.allAppVersions = allAppVersions;
            }, error => { });
            this.toastService.success(this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.SUCCESS.DELETE_UPDATE_VERSION'));
        }, error => { })
    }
}
