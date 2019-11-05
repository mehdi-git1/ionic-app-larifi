import * as _ from 'lodash';

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { TabHeaderModeEnum } from '../../../../../../core/enums/tab-header-mode.enum';
import { TabHeaderEnum } from '../../../../../../core/enums/tab-header.enum';
import { TextEditorModeEnum } from '../../../../../../core/enums/text-editor-mode.enum';
import { AppVersionModel } from '../../../../../../core/models/admin/app-version.model';
import {
    AppVersionAlertService
} from '../../../../../../core/services/app-version/app-version-alert.service';
import { AppVersionService } from '../../../../../../core/services/app-version/app-version.service';
import { SecurityService } from '../../../../../../core/services/security/security.service';
import { ToastService } from '../../../../../../core/services/toast/toast.service';
import { DateTransform } from '../../../../../../shared/utils/date-transform';
import { Utils } from '../../../../../../shared/utils/utils';

@Component({
    selector: 'page-app-version-create',
    templateUrl: 'app-version-create.page.html',
    styleUrls: ['./app-version-create.page.scss']
})
export class AppVersionCreatePage {

    TabHeaderModeEnum = TabHeaderModeEnum;

    TabHeaderEnum = TabHeaderEnum;

    versionNumberRegex = /([0-9]{1,2}[.]){2}[0-9]{1,2}/;

    creationAppVersionForm: FormGroup;

    appVersion: AppVersionModel;
    originAppVersion: AppVersionModel;

    TextEditorModeEnum = TextEditorModeEnum;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private alertCtrl: AlertController,
        public translateService: TranslateService,
        private formBuilder: FormBuilder,
        private appVersionService: AppVersionService,
        private toastService: ToastService,
        public securityService: SecurityService,
        private dateTransformer: DateTransform,
        private appVersionAlertService: AppVersionAlertService) {

        // Initialisation du formulaire
        this.initForm();
    }

    ionViewDidEnter() {
        this.initPage();
    }

    ionViewCanLeave() {
        if (this.formHasBeenModified()) {
            return this.confirmAbandonChanges();
        } else {
            return true;
        }
    }

    /**
     * Popup d'avertissement en cas de modifications non enregistrées.
     */
    confirmAbandonChanges() {
        return new Promise((resolve, reject) => {
            // Avant de quitter la vue, on avertit l'utilisateur si ses modifications n'ont pas été enregistrées
            this.alertCtrl.create({
                header: this.translateService.instant('GLOBAL.CONFIRM_BACK_WITHOUT_SAVE.TITLE'),
                message: this.translateService.instant('GLOBAL.CONFIRM_BACK_WITHOUT_SAVE.MESSAGE'),
                buttons: [
                    {
                        text: this.translateService.instant('GLOBAL.BUTTONS.CANCEL'),
                        role: 'cancel',
                        handler: () => reject()
                    },
                    {
                        text: this.translateService.instant('GLOBAL.BUTTONS.CONFIRM'),
                        handler: () => resolve()
                    }
                ]
            }).then(alert => alert.present());
        });
    }

    /**
     * Initialisation du contenu de la page.
     */
    initPage() {
        // On récupère l'id de la version dans les paramètres de navigation
        if (this.activatedRoute.snapshot.paramMap.get('appVersionId')
            && parseInt(this.activatedRoute.snapshot.paramMap.get('appVersionId'), 10) !== 0) {
            // Récupération de la version
            this.appVersionService.getAppVersionById(parseInt(this.activatedRoute.snapshot.paramMap.get('appVersionId'), 10))
                .then(appVersionList => {
                    this.originAppVersion = _.cloneDeep(appVersionList);
                    this.appVersion = appVersionList;
                }, error => { });
        } else {
            // Mode Création
            this.appVersion = new AppVersionModel();
            this.originAppVersion = _.cloneDeep(this.appVersion);
        }
    }

    /**
     * Initialise le formulaire
     */
    initForm() {
        this.creationAppVersionForm = this.formBuilder.group({
            numberControl: ['', Validators.required],
            releaseDateControl: [''],
            changelogControl: ['', Validators.maxLength(4000)]
        });
    }

    /**
     * Crée ou met à jour une version
     * @param appVersion La version créée ou mise à jour
     */
    createOrUpdateAppVersion(appVersion: AppVersionModel) {
        this.appVersion = appVersion;
        this.appVersion.releaseDate = this.dateTransformer.transformDateStringToIso8601Format(this.appVersion.releaseDate);

        if (!this.versionNumberRegex.test(this.appVersion.number)) {
            return this.toastService.error(this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.ERROR.UNDEFINED_NUMBER'));
        }
        this.originAppVersion = this.appVersion;
        this.appVersionService
            .createOrUpdateAppVersion(this.appVersion)
            .then(success => {
                this.goToAppVersionManagement();
                this.toastService.success(this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.SUCCESS.CREATE_OR_UPDATE_VERSION'));
            }, error => { });
    }

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
            this.goToAppVersionManagement();
            this.toastService.success(this.translateService.instant('ADMIN.APP_VERSION_MANAGEMENT.SUCCESS.DELETE_UPDATE_VERSION'));
        }, error => { });
    }

    /**
     * Vérifie que le chargement de la version est terminé
     * @return true si c'est le cas, false sinon
     */
    appVersionLoadingIsOver(): boolean {
        return this.appVersion !== undefined;
    }

    /**
     * Affiche un aperçu de la version
     * @param appVersion la version dont on souhaite voir l'aperçu
     */
    displayOverview(appVersion: AppVersionModel) {
        this.appVersionAlertService.displayAppVersion(appVersion);
    }

    isCreation() {
        return this.appVersion.techId == null;
    }

    formHasBeenModified() {
        return Utils.getHashCode(this.originAppVersion) !== Utils.getHashCode(this.appVersion);
    }

    goToAppVersionManagement() {
        this.router.navigate(['admin', 'app-version', 'list']);
    }

}
