import { Utils } from './../../../../../../shared/utils/utils';
import { AppVersionListPage } from './../app-version-list/app-version-list.page';
import { AppVersionService } from './../../../../../../core/services/app-version/app-version.service';
import { AppVersionModel } from './../../../../../../core/models/admin/app-version.model';
import { DateTransform } from '../../../../../../shared/utils/date-transform';
import { AppConstant } from '../../../../../../app.constant';
import { SecurityService } from '../../../../../../core/services/security/security.service';
import { ToastService } from '../../../../../../core/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { TabHeaderModeEnum } from '../../../../../../core/enums/tab-header-mode.enum';
import { TabHeaderEnum } from '../../../../../../core/enums/tab-header.enum';
import { AppVersionAlertService } from '../../../../../../core/services/app-version/app-version-alert.service';

@Component({
    selector: 'page-app-version-create',
    templateUrl: 'app-version-create.page.html',
})
export class AppVersionCreatePage {

    TabHeaderModeEnum = TabHeaderModeEnum;
    TabHeaderEnum = TabHeaderEnum;

    datepickerMaxDate = AppConstant.datepickerMaxDate;
    monthsNames: any;
    versionNumberRegex = /([0-9]{1,2}[.]){2}[0-9]{1,2}/;

    creationAppVersionForm: FormGroup;

    appVersion: AppVersionModel;
    originAppVersion: AppVersionModel;

    loading: Loading;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private alertCtrl: AlertController,
        public translateService: TranslateService,
        private formBuilder: FormBuilder,
        private appVersionService: AppVersionService,
        private toastService: ToastService,
        public securityService: SecurityService,
        public loadingCtrl: LoadingController,
        private dateTransformer: DateTransform,
        private appVersionAlertService: AppVersionAlertService) {

        // Traduction des mois
        this.monthsNames = this.translateService.instant('GLOBAL.MONTH.LONGNAME');

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
                title: this.translateService.instant('GLOBAL.CONFIRM_BACK_WITHOUT_SAVE.TITLE'),
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
            }).present();
        });
    }

    /**
     * Initialisation du contenu de la page.
     */
    initPage() {
        // On récupère l'id de la version dans les paramètres de navigation
        if (this.navParams.get('appVersionId') && this.navParams.get('appVersionId') !== 0) {
            // Récupération de la version
            this.appVersionService.getAppVersionById(this.navParams.get('appVersionId')).then(appVersionList => {
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
        console.log('delete', appVersion.techId);
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
        this.navCtrl.push(AppVersionListPage);
    }

    /**
     * Récupère le contenu du WYSIWYG
     * @param content contenu du WYSIWYG
     */
    setContent(content) {
        this.appVersion.changelog = content;
        console.log(this.appVersion.changelog);
    }

}
