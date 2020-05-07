import * as _ from 'lodash';
import { PncService } from 'src/app/core/services/pnc/pnc.service';

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { TextEditorModeEnum } from '../../../../core/enums/text-editor-mode.enum';
import { HrDocumentCategory } from '../../../../core/models/hr-document/hr-document-category';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';
import { PncLightModel } from '../../../../core/models/pnc-light.model';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import {
    OnlineHrDocumentService
} from '../../../../core/services/hr-documents/online-hr-document.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { FormCanDeactivate } from '../../../../routing/guards/form-changes.guard';
import { Utils } from '../../../../shared/utils/utils';

@Component({
    selector: 'hr-document',
    templateUrl: 'hr-document.component.html',
    styleUrls: ['./hr-document.component.scss']
})
export class HrDocumentComponent extends FormCanDeactivate implements OnInit {

    @Input() hrDocument: HrDocumentModel;

    @Input() mode: HrDocumentModeEnum;

    @ViewChild('form', { static: false }) form: NgForm;

    pncMatricule: string;

    hrDocumentCategories: HrDocumentCategory[];
    originHrDocument: HrDocumentModel;

    titleMaxLength = 100;

    customPopoverOptions = { cssClass: 'hr-document-popover-select' };

    HrDocumentModeEnum = HrDocumentModeEnum;
    TextEditorModeEnum = TextEditorModeEnum;

    hrDocumentForm: FormGroup;

    constructor(
        private router: Router,
        private translateService: TranslateService,
        private sessionService: SessionService,
        private onlineHrDocumentService: OnlineHrDocumentService,
        private toastService: ToastService,
        private loadingCtrl: LoadingController,
        private connectivityService: ConnectivityService,
        private navCtrl: NavController,
        private formBuilder: FormBuilder,
        private pncService: PncService,
        private activatedRoute: ActivatedRoute,
        private alertCtrl: AlertController) {
        super();
        this.initForm();
    }

    ngOnInit() {
        this.initPage();
    }

    /**
     * Initialise le contenue de la page
     */
    initPage() {
        if (this.mode === HrDocumentModeEnum.CREATION) {
            this.hrDocument = new HrDocumentModel();
            this.hrDocument.pnc = new PncLightModel();
            const matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
            this.hrDocument.pnc.matricule = matricule;
        }
        this.originHrDocument = _.cloneDeep(this.hrDocument);
    }

    /**
     * Initialise le formulaire et la liste déroulante des catégories depuis les paramètres
     */
    initForm() {
        if (this.sessionService.getActiveUser().appInitData !== undefined
            && this.sessionService.getActiveUser().appInitData.hrDocumentCategories
            && this.sessionService.getActiveUser().appInitData.hrDocumentCategories !== undefined) {
            this.hrDocumentCategories =
                this.sortProfessionalInterviewItems(this.sessionService.getActiveUser().appInitData.hrDocumentCategories);
        }

        this.hrDocumentForm = this.formBuilder.group({
            category: ['', Validators.required],
            title: ['', [Validators.maxLength(100), Validators.required]],
            content: ''
        });
    }

    /**
     * Trie les catégories par ordre
     * @param hrDocumentCategories tableau de catégories à trier
     * @return tableau de catégories triées
     */
    private sortProfessionalInterviewItems(hrDocumentCategories: HrDocumentCategory[]): HrDocumentCategory[] {
        return hrDocumentCategories.sort((category1, category2) => {
            return category1.order < category2.order ? -1 : 1;
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
        this.navCtrl.pop();
    }

    /**
     * Enregistre le document RH
     */
    saveHrDocument() {
        return new Promise((resolve, reject) => {
            this.loadingCtrl.create().then(loading => {
                loading.present();

                this.onlineHrDocumentService.createOrUpdate(this.hrDocument)
                    .then(savedHrDocument => {
                        this.originHrDocument = _.cloneDeep(savedHrDocument);
                        this.hrDocument = savedHrDocument;
                        if (this.mode === HrDocumentModeEnum.CREATION) {
                            this.toastService.success(this.translateService.instant('HR_DOCUMENT.EDIT.HR_DOCUMENT_SAVED'));
                        } else if (this.mode === HrDocumentModeEnum.EDITION) {
                            this.toastService.success(this.translateService.instant('HR_DOCUMENT.EDIT.HR_DOCUMENT_EDITED'));
                        }
                        this.hrDocumentForm.markAsPristine();
                        this.navCtrl.pop();
                        loading.dismiss();
                    }, error => {
                        loading.dismiss();
                    });
            });

        });
    }

    /**
     * Vérifie si le formulaire est valide
     */
    isFormValid(): boolean {
        return this.connectivityService.isConnected() &&
            (this.hrDocumentForm.valid
                && (this.hrDocument.attachmentFiles && this.hrDocument.attachmentFiles.length > 0)
                || !Utils.isEmpty(this.hrDocument.content));
    }

    /**
     * Annule la création/edition du document RH et route vers la page d'acceuil des documents RH du dossier en cours
     */
    goToHrDocumentList() {
        if (this.hrDocument && this.hrDocument.pnc && this.hrDocument.pnc.matricule
            && this.sessionService.isActiveUserMatricule(this.hrDocument.pnc.matricule)) {
            this.router.navigate(['tabs', 'hr-document']);
        } else {
            this.router.navigate(['tabs', 'visit', this.sessionService.visitedPnc.matricule, 'hr-document']);
        }
    }

    /**
     * Confirmation de suppression du document à supprimer
     */
    confirmDeleteDocument() {
        this.alertCtrl.create({
            header: this.translateService.instant('HR_DOCUMENT.CONFIRM_DELETE.TITLE'),
            message: this.translateService.instant('HR_DOCUMENT.CONFIRM_DELETE.MESSAGE'),
            buttons: [
                {
                    text: this.translateService.instant('HR_DOCUMENT.CONFIRM_DELETE.CANCEL'),
                    role: 'cancel'
                },
                {
                    text: this.translateService.instant('HR_DOCUMENT.CONFIRM_DELETE.CONFIRM'),
                    handler: () => this.markedAsDeleted()
                }
            ]
        }).then(alert => {
            alert.present();
        });
    }

    /**
     * Marque le document RH comme supprimé et appelle la méthode pour la mise à jour"
     */
    markedAsDeleted() {
        this.hrDocument.deleted = true;
        this.hrDocument.attachmentFiles = new Array();
        this.deleteHrDocument();
    }

    deleteHrDocument() {
        return new Promise((resolve, reject) => {
            this.loadingCtrl.create().then(loading => {
                loading.present();

                this.onlineHrDocumentService.createOrUpdate(this.hrDocument)
                    .then(savedHrDocument => {
                        this.toastService.success(this.translateService.instant('HR_DOCUMENT.DELETE.HR_DOCUMENT_DELETED'));
                        this.goToHrDocumentList();
                        loading.dismiss();
                    }, error => {
                        loading.dismiss();
                    });
            });
        });
    }
}
