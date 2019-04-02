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
    number: AbstractControl;
    changelog: AbstractControl;

    allAppVersions: AppVersionModel[];
    appVersion: AppVersionModel;

    constructor(private appVersionService: AppVersionService,
        private translateService: TranslateService,
        private toastService: ToastService,
        private formBuilder: FormBuilder) {
        this.appVersionForm = formBuilder.group({
            number: ['', [Validators.required, Validators.pattern('^([0-9]{1,2}[.]){2}[0-9]{1,2}')]],
            changelog: ['']
        });
        this.number = this.appVersionForm.controls['number'];
        this.changelog = this.appVersionForm.controls['changelog'];
    }

    ionViewDidEnter() {
        this.appVersionService.getAllAppVersions().then(allAppVersions => {
            this.allAppVersions = allAppVersions;
        }, error => { });
    }

    /**
     * Crée une Version
     * @param appVersion la version à ajouter
     */
    createAppVersion(): void {
        if (!this.appVersionForm.valid) {
            return this.toastService.error(this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.ERROR.UNDEFINED_NUMBER'));
        }
        this.appVersion = new AppVersionModel();
        this.appVersion.number = this.number.value;
        this.appVersion.changelog = this.changelog.value;
        this.appVersionService
            .createAppVersion(this.appVersion)
            .then(success => {
                this.appVersionService.getAllAppVersions().then(allAppVersions => {
                    this.allAppVersions = allAppVersions;
                }, error => { });
                this.toastService.success(this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.SUCCESS.CREATE_VERSION'));
            }, error => { });
    }
}
