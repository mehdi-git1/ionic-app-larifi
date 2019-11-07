import * as _ from 'lodash';

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { TextEditorModeEnum } from '../../../../core/enums/text-editor-mode.enum';
import { HrDocumentCategory } from '../../../../core/models/hr-document/hr-document-category';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';
import { PncLightModel } from '../../../../core/models/pnc-light.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import {
    OnlineHrDocumentService
} from '../../../../core/services/hr-documents/online-hr-document.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { Utils } from '../../../../shared/utils/utils';

@Component({
    selector: 'hr-document',
    templateUrl: 'hr-document.component.html',
    styleUrls: ['./hr-document.component.scss']
})
export class HrDocumentComponent implements OnInit {

    @Input() hrDocument: HrDocumentModel;

    @Input() mode: HrDocumentModeEnum;

    pnc: PncModel;

    hrDocumentCategories: HrDocumentCategory[];
    originHrDocument: HrDocumentModel;

    titleMaxLength = 100;

    HrDocumentModeEnum = HrDocumentModeEnum;
    TextEditorModeEnum = TextEditorModeEnum;

    hrDocumentForm: FormGroup;

    cancelFromButton = false;

    constructor(
        private translateService: TranslateService,
        private sessionService: SessionService,
        private onlineHrDocumentService: OnlineHrDocumentService,
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
            this.hrDocumentCategories = this.sessionService.getActiveUser().appInitData.hrDocumentCategories;
        }

        this.hrDocumentForm = this.formBuilder.group({
            category: ['', Validators.required],
            title: ['', [Validators.maxLength(100), Validators.required]],
            content: ['', Validators.maxLength(4000)],
        });
    }

    /**
     *  Compare deux categories et renvois true si elles sont égales
     *
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
     * Annule la création / modification de l'évènement en appuyant sur le bouton annuler.
     */
    cancelCreation() {
        this.cancelFromButton = true;
        this.confirmCancel();
    }

    /**
     * Annule la création du document RH
     */
    confirmCancel() {
        if (this.formHasBeenModified()) {
            return this.confirmAbandonChanges().then(() => {
                this.hrDocument = _.cloneDeep(this.originHrDocument);
                if (this.cancelFromButton) {
                    this.cancelFromButton = false;
                }
                return true;
            }).catch(() => {
                this.cancelFromButton = false;
                return false;
            });
        } else {
            if (this.cancelFromButton) {
                this.cancelFromButton = false;
            }
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
            }).then(alert => {
                alert.present();
            });
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
     * Enregistre le document RH
     */
    saveHrDocument() {
        return new Promise((resolve, reject) => {
            this.loadingCtrl.create().then(loading => {
                loading.present();
            });

            this.onlineHrDocumentService.createOrUpdate(this.hrDocument)
                .then(savedHrDocument => {
                    this.originHrDocument = _.cloneDeep(savedHrDocument);
                    this.hrDocument = savedHrDocument;
                    if (this.mode === HrDocumentModeEnum.CREATION) {
                        this.toastService.success(this.translateService.instant('HR_DOCUMENT.EDIT.HR_DOCUMENT_SAVED'));
                    } else if (this.mode === HrDocumentModeEnum.EDITION) {
                        this.toastService.success(this.translateService.instant('HR_DOCUMENT.EDIT.HR_DOCUMENT_EDITED'));
                    }

                }, error => {
                });

        });
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
