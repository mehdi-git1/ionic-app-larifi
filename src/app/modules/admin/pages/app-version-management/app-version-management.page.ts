import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { AppVersionModel } from './../../../../core/models/admin/app-version.model';

import { AppVersionService } from './../../../../core/services/app-version/app-version.service';
import { ToastService } from '../../../../core/services/toast/toast.service';

import { TextEditorModeEnum } from './../../../../core/enums/text-editor-mode.enum';

@Component({
    selector: 'page-app-version-management',
    templateUrl: 'app-version-management.page.html',
})
export class AppVersionManagementPage {

    matPanelHeaderHeight = '41px';
    number: string;
    changelog: string;

    versionNumberRegex = /([0-9]{1,2}[.]){2}[0-9]{1,2}/;

    allAppVersions: AppVersionModel[];

    selectedAppVersion: AppVersionModel;

    textEditorModeEnum = TextEditorModeEnum.FULL;

    constructor(private appVersionService: AppVersionService,
        private translateService: TranslateService,
        private alertCtrl: AlertController,
        private toastService: ToastService) {
    }

    ionViewDidEnter() {
        this.initPage();
    }

    initPage() {
        this.appVersionService.getAllAppVersions().then(allAppVersions => {
            this.allAppVersions = allAppVersions;
        }, error => { });
    }

    /**
     * Permet de savoir quelle version est à créer ou à modifier
     * @param appVersion la version à modifier
     */
    editAppVersion(appVersion: AppVersionModel) {
        this.selectedAppVersion = appVersion;
    }

    /**
     * Crée ou met à jour une version
     * @param appVersion La version créée ou mise à jour
     */
    createOrUpdateAppVersion(appVersion: AppVersionModel): void {
        if (appVersion == null) {
            this.selectedAppVersion = new AppVersionModel();
            this.selectedAppVersion.number = this.number;
            this.selectedAppVersion.changelog = this.changelog;
        } else {
            this.selectedAppVersion = appVersion;
        }
        if (!this.versionNumberRegex.test(this.selectedAppVersion.number)) {
            return this.toastService.error(this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.ERROR.UNDEFINED_NUMBER'));
        }
        this.appVersionService
            .createOrUpdateAppVersion(this.selectedAppVersion)
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

    /**
     * Récupère le contenu du WYSIWYG de l'enfant
     * @param content contenu du WYSIWYG
     */
    manageContent(content) {
        // pour créer une version sinon pour modifier une version
        if (this.selectedAppVersion == undefined) {
            this.changelog = content;

        } else {
            this.selectedAppVersion.changelog = content;
        }
    }
}
