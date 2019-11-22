import { PncService } from 'src/app/core/services/pnc/pnc.service';
import { SessionService } from 'src/app/core/services/session/session.service';

import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { TextEditorModeEnum } from '../../../../core/enums/text-editor-mode.enum';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';
import {
    OnlineHrDocumentService
} from '../../../../core/services/hr-documents/online-hr-document.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { ToastService } from '../../../../core/services/toast/toast.service';

@Component({
    selector: 'hr-document-card',
    templateUrl: 'hr-document-card.component.html',
    styleUrls: ['./hr-document-card.component.scss']
})
export class HrDocumentCardComponent {

    @Input() hrDocument: HrDocumentModel;

    TextEditorModeEnum = TextEditorModeEnum;

    constructor(
        private securityService: SecurityService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private alertCtrl: AlertController,
        private translateService: TranslateService,
        private loadingCtrl: LoadingController,
        private onlineHrDocumentService: OnlineHrDocumentService,
        private toastService: ToastService,
        private navCtrl: NavController,
        private datePipe: DatePipe,
        private sessionService: SessionService,
        private pncService: PncService) {
    }

    canEditDocument() {
        return true;
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
        this.saveHrDocument();
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
                        this.toastService.success(this.translateService.instant('HR_DOCUMENT.DELETE.HR_DOCUMENT_DELETED'));
                        this.navCtrl.pop();
                        loading.dismiss();
                    }, error => {
                        loading.dismiss();
                    });
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
     * Vérifie si le PNC est le redacteur, l'instructeur referent ou le RDS
     * @return vrai si le PNC est manager, faux sinon
     */
    canDelete(): boolean {
        this.pncService.getPnc(this.hrDocument.pnc.matricule).then(concernedPnc => {
            return this.hrDocument.redactor.matricule === this.sessionService.getActiveUser().matricule
                || concernedPnc.pncRds.matricule === this.sessionService.getActiveUser().matricule
                || concernedPnc.pncInstructor.matricule === this.sessionService.getActiveUser().matricule;
        }, error => {
            return false;
        });
        return false;
    }

    /**
     * Dirige vers la page de modification d'un document RH
     */
    editHrDocument() {
        this.router.navigate(['../..', 'create', this.hrDocument.techId], { relativeTo: this.activatedRoute });
    }

    /**
     * Retourne la date de dernière modification, formatée pour l'affichage
     * @return la date de dernière modification au format dd/mm/
     */
    getLastUpdateDate(): string {
        return this.datePipe.transform(this.hrDocument.lastUpdateDate, 'dd/MM/yyyy HH:mm');
    }

    /**
     * Affiche le message d'information de la dernière modification faite sur le document
     */
    showInformationMessage() {
        return this.hrDocument.lastUpdateAuthor && this.hrDocument.lastUpdateDate !== this.hrDocument.creationDate;
    }
}
