import { AppVersionModel } from './../../../../core/models/admin/app-version.model';
import { AppVersionService } from './../../../../core/services/app-version/app-version.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'page-app-version-management',
    templateUrl: 'app-version-management.page.html',
})
export class AppVersionManagementPage {

    public appVersionForm: FormGroup;

    allAppVersions: AppVersionModel[];
    appVersion: AppVersionModel;

    constructor(private appVersionService: AppVersionService,
        private translateService: TranslateService,
        private toastService: ToastService,
        public formBuilder: FormBuilder) {
        this.appVersionForm = formBuilder.group({
            number: ['', [Validators.required, Validators.pattern('^([0-9]{1,2}[.]){2}[0-9]{1,2}')]],
            changelog: ['']
        });
    }

    ionViewDidEnter() {
        this.appVersionService.getAllAppVersion().then(allAppVersions => {
            this.allAppVersions = allAppVersions;
        }, error => { });
    }

    /**
     * Crée une Version
     * @param appVersion la version à ajouter
     */
    createChangelog(number: string, changelog: string): void {
        if (!this.appVersionForm.valid) {
            return this.toastService.error(this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.ERROR.UNDEFINED_NUMBER'));
        }
        this.appVersion = new AppVersionModel(number, changelog);
        this.appVersionService.create(this.appVersion);
        this.allAppVersions.push(this.appVersion);
        this.toastService.success(this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.SUCCESS.CREATE_VERSION'));
    }
}
