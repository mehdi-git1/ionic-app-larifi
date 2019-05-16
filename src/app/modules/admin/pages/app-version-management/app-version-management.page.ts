import { DateTransform } from './../../../../shared/utils/date-transform';
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
    releaseDate: string;

    monthsNames: any;

    versionNumberRegex = /([0-9]{1,2}[.]){2}[0-9]{1,2}/;

    allAppVersions: AppVersionModel[];
    appVersion: AppVersionModel;



    constructor(private appVersionService: AppVersionService,
        private dateTransformer: DateTransform,
        private translateService: TranslateService,
        private alertCtrl: AlertController,
        private toastService: ToastService) {

        // Traduction des mois
        this.monthsNames = this.translateService.instant('GLOBAL.MONTH.LONGNAME');
    }

    ionViewDidEnter() {
        this.initPage();
    }

    initPage() {
        this.appVersionService.getAllAppVersions().then(allAppVersions => {
            this.allAppVersions = allAppVersions;
            console.log(this.allAppVersions);
        }, error => { });
    }

    /**
     * Crée ou met à jour une version
     * @param appVersion La version créée ou mise à jour
     */
    createOrUpdateAppVersion(appVersion: AppVersionModel): void {
        console.log(this.releaseDate);
        if (appVersion == null) {
            this.appVersion = new AppVersionModel();
            this.appVersion.number = this.number;
            this.appVersion.changelog = this.changelog;
            this.appVersion.releaseDate = this.dateTransformer.transformDateStringToIso8601Format(this.releaseDate);
        } else {
            this.appVersion = appVersion;
            this.appVersion.releaseDate = this.dateTransformer.transformDateStringToIso8601Format(this.appVersion.releaseDate);
        }
        if (!this.versionNumberRegex.test(this.appVersion.number)) {
            return this.toastService.error(this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.ERROR.UNDEFINED_NUMBER'));
        }
        this.appVersionService
            .createOrUpdateAppVersion(this.appVersion)
            .then(success => {
                this.initPage();
                this.toastService.success(this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.SUCCESS.CREATE_OR_UPDATE_VERSION'));
            }, error => { });
    }

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
            this.initPage();
            this.toastService.success(this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.SUCCESS.DELETE_UPDATE_VERSION'));
        }, error => { });
    }
}
