import { AlertController, Loading, LoadingController, NavController } from 'ionic-angular';
import * as _ from 'lodash';

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { TextEditorModeEnum } from '../../../../core/enums/text-editor-mode.enum';
import { HrDocumentCategory } from '../../../../core/models/hr-document/hr-document-category';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';
import { PncLightModel } from '../../../../core/models/pnc-light.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import {
    OnlineHrDocumentsService
} from '../../../../core/services/hr-documents/hr-documents.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { Utils } from '../../../../shared/utils/utils';

@Component({
    selector: 'hr-document',
    templateUrl: 'hr-document.component.html',
})
export class HrDocumentComponent implements OnInit {

    @Input() hrDocument: HrDocumentModel;

    @Input() mode: HrDocumentModeEnum;

    pnc: PncModel;
    loading: Loading;

    hrDocumentCategories: HrDocumentCategory[];
    originHrDocument: HrDocumentModel;

    titleMaxLength = 100;

    HrDocumentModeEnum = HrDocumentModeEnum;
    TextEditorModeEnum = TextEditorModeEnum;

    hrDocumentForm: FormGroup;

    constructor(private securityService: SecurityService,
        private translateService: TranslateService,
        private sessionService: SessionService,
        private onlineHrDocumentsService: OnlineHrDocumentsService,
        private navCtrl: NavController,
        private toastService: ToastService,
        private loadingCtrl: LoadingController,
        private connectivityService: ConnectivityService,
        private alertCtrl: AlertController,
        private formBuilder: FormBuilder) {

        this.initForm();
    }

    ngOnInit() {
        if (this.sessionService.visitedPnc) {
            this.pnc = this.sessionService.visitedPnc;
        } else {
            this.pnc = this.sessionService.getActiveUser().authenticatedPnc;
        }
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
     * Initialise le contenue de la page
     */
    initPage() {
        if (this.mode === HrDocumentModeEnum.CREATION) {
            this.hrDocument = new HrDocumentModel();
            this.hrDocument.pnc = new PncLightModel();
            this.hrDocument.pnc.matricule = this.pnc.matricule;
        }
        this.originHrDocument = _.cloneDeep(this.hrDocument);
    }

    /**
    * Initialise le formulaire et la liste déroulante des catégories depuis les paramètres
    */
    initForm() {
        if (this.sessionService.getActiveUser().appInitData !== undefined) {
            //this.hrDocumentCategories = this.sessionService.getActiveUser().appInitData.hrDocumentCategories;
            this.hrDocumentCategories = new Array();
            const category = new HrDocumentCategory();
            category.id = 'Informations';
            category.label = 'Informations';
            this.hrDocumentCategories.push(category);
        }

        this.hrDocumentForm = this.formBuilder.group({
            category: ['', Validators.required],
            title: ['', [Validators.maxLength(100), Validators.required]],
            content: ['', Validators.maxLength(4000)],
        });
    }

    /**
     *  Compare deux categories et renvois true si elles sont égales
     * @param category1 premiere categorie à comparér
     * @param category2 Deuxieme categorie à comparér
     */
    compareCategories(category1: HrDocumentCategory, category2: HrDocumentCategory): boolean {
        if (category1.id === category2.id) {
            return true;
        }
        return false;
    }

    /**
     * Annule la création de la lettre
     */
    cancelCreation() {
        this.navCtrl.pop();
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
    * Vérifie si le formulaire a été modifié sans être enregistré
    * @return true si il n'y a pas eu de modifications
    */
    formHasBeenModified() {
        return Utils.getHashCode(this.originHrDocument) !== Utils.getHashCode(this.hrDocument);
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.hrDocument !== undefined && this.hrDocument !== null;
    }

    /**
     * Enregistre l'évènement du journal de bord
     */
    saveHrDocument() {
        return new Promise((resolve, reject) => {
            this.loading = this.loadingCtrl.create();
            this.loading.present();

            this.onlineHrDocumentsService.createOrUpdate(this.hrDocument)
                .then(savedHrDocument => {
                    this.originHrDocument = _.cloneDeep(savedHrDocument);
                    this.hrDocument = savedHrDocument;
                    if (this.mode === HrDocumentModeEnum.CREATION) {
                        this.toastService.success(this.translateService.instant('HR_DOCUMENTS.EDIT.HR_DOCUMENT_SAVED'));
                        this.navCtrl.pop();
                    }
                    this.loading.dismiss();
                }, error => {
                    this.loading.dismiss();
                });

        });
    }

    /**
     * Vérifie si le PNC est manager
     * @return vrai si le PNC est manager, faux sinon
     */
    isManager(): boolean {
        return this.securityService.isManager();
    }

    /**
     * Vérifie si le formulaire est valide
     */
    isFormValid(): boolean {
        return this.connectivityService.isConnected() &&
            this.hrDocumentForm.valid
            && (this.hrDocument.attachmentFiles && this.hrDocument.attachmentFiles.length > 0);
    }
}
