import { AlertController, Loading, LoadingController, NavController } from 'ionic-angular';

import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { TextEditorModeEnum } from '../../../../core/enums/text-editor-mode.enum';
import { DocumentModel } from '../../../../core/models/document.model';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';
import {
    OnlineHrDocumentService
} from '../../../../core/services/hr-documents/online-hr-document.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { ToastService } from '../../../../core/services/toast/toast.service';

@Component({
    selector: 'hr-document-card',
    templateUrl: 'hr-document-card.component.html',
})
export class HrDocumentCardComponent {

    @Input() hrDocument: HrDocumentModel;

    TextEditorModeEnum = TextEditorModeEnum;

    loading: Loading;

    constructor(private securityService: SecurityService,
        private alertCtrl: AlertController,
        private translateService: TranslateService,
        private loadingCtrl: LoadingController,
        private onlineHrDocumentService: OnlineHrDocumentService,
        private toastService: ToastService,
        private navCtrl: NavController) {
    }

    canEditDocument() {
        return true;
    }

    /**
     * Confirmation de suppression du document à supprimer
     */
    confirmDeleteDocument() {
        this.alertCtrl.create({
            title: this.translateService.instant('HR_DOCUMENT.CONFIRM_DELETE.TITLE'),
            message: this.translateService.instant('HR_DOCUMENT.CONFIRM_DELETE.MESSAGE'),
            buttons: [
                {
                    text: this.translateService.instant('HR_DOCUMENT.CONFIRM_DELETE.CANCEL'),
                    role: 'cancel'
                },
                {
                    text: this.translateService.instant('HR_DOCUMENT.CONFIRM_DELETE.CONFIRM'),
                    handler: () => this.isMarkedAsDeleted()
                }
            ]
        }).present();
    }

    /**
     * Marque l'eObs comme supprimée et appelle la méthode pour la mise à jour"
     */
    isMarkedAsDeleted() {
        this.hrDocument.deleted = true;
        this.hrDocument.attachmentFiles = new Array();
        this.saveHrDocument();
    }

    /**
     * Enregistre le document RH
     */
    saveHrDocument() {
        return new Promise((resolve, reject) => {
            this.loading = this.loadingCtrl.create();
            this.loading.present();

            this.onlineHrDocumentService.createOrUpdate(this.hrDocument)
                .then(savedHrDocument => {
                    this.toastService.success(this.translateService.instant('HR_DOCUMENT.DELETE.HR_DOCUMENT_DELETED'));
                    this.navCtrl.pop();
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
}
