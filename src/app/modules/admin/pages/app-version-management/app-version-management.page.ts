import { AppVersionModel } from './../../../../core/models/admin/app-version.model';
import { AppVersionService } from './../../../../core/services/app-version/app-version.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'page-app-version-management',
    templateUrl: 'app-version-management.page.html',
})
export class AppVersionManagementPage {

    appVersions: AppVersionModel[];
    appVersion: AppVersionModel;

    constructor(private appVersionService: AppVersionService,
        private translateService: TranslateService,
        private navCtrl: NavController,
        private toastService: ToastService) { }

    ionViewDidEnter() {
        this.appVersionService.getAllAppVersion().then(appVersions => {
            this.appVersions = appVersions;
            console.log(this.appVersions);
        }, error => { });

    }

    /**
     * Crée une Version
     * @param appVersion la version à ajouter
     */
    createChangelog(number: string, changelog: string): void {
        if (number == null) {
            this.toastService.error(this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.ERROR.UNDEFINED_NUMBER'));
            return null;
        }
        this.appVersion = new AppVersionModel(number, changelog);
        this.appVersionService.create(this.appVersion);
        this.toastService.success(this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.SUCCESS.CREATE_VERSION'));
        this.navCtrl.push(AppVersionManagementPage);
    }
}
