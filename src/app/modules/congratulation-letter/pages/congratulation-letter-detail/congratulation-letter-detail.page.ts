import {
    CongratulationLetterModeEnum
} from 'src/app/core/enums/congratulation-letter/congratulation-letter-mode.enum';
import { ConnectivityService } from 'src/app/core/services/connectivity/connectivity.service';
import { SecurityService } from 'src/app/core/services/security/security.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, Events, LoadingController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import {
    CongratulationLetterRedactorTypeEnum
} from '../../../../core/enums/congratulation-letter/congratulation-letter-redactor-type.enum';
import { TextEditorModeEnum } from '../../../../core/enums/text-editor-mode.enum';
import {
    CongratulationLetterFlightModel
} from '../../../../core/models/congratulation-letter-flight.model';
import { CongratulationLetterModel } from '../../../../core/models/congratulation-letter.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    CongratulationLetterService
} from '../../../../core/services/congratulation-letter/congratulation-letter.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { Utils } from '../../../../shared/utils/utils';
import { FixRecipientComponent } from '../../components/fix-recipient/fix-recipient.component';

@Component({
    selector: 'congratulation-letter-detail',
    templateUrl: 'congratulation-letter-detail.page.html',
    styleUrls: ['./congratulation-letter-detail.page.scss']
})
export class CongratulationLetterDetailPage {

    mode: CongratulationLetterModeEnum;

    matricule: string;
    pnc: PncModel;

    congratulationLetter: CongratulationLetterModel;

    CongratulationLetterRedactorTypeEnum = CongratulationLetterRedactorTypeEnum;
    TextEditorModeEnum = TextEditorModeEnum;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private congratulationLetterService: CongratulationLetterService,
        private pncService: PncService,
        private datePipe: DatePipe,
        private popoverCtrl: PopoverController,
        private alertCtrl: AlertController,
        private translateService: TranslateService,
        private loadingCtrl: LoadingController,
        private toastService: ToastService,
        private events: Events,
        private securityService: SecurityService,
        private connectivityService: ConnectivityService,
        private sessionService: SessionService
    ) {
    }

    ionViewDidEnter() {
        this.matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
        this.pncService.getPnc(this.matricule).then(pnc => {
            this.pnc = pnc;
        }, error => { });

        this.congratulationLetterService.getCongratulationLetter(
            parseInt(this.activatedRoute.snapshot.paramMap.get('congratulationLetterId'), 10))
            .then(congratulationLetter => {
                this.congratulationLetter = congratulationLetter;
                if (this.isReceivedMode()) {
                    this.mode = CongratulationLetterModeEnum.RECEIVED;
                } else {
                    this.mode = CongratulationLetterModeEnum.WRITTEN;
                }
            }, error => { });
    }

    /**
     * Teste si le chargement des ressources est terminé
     * @return vrai si c'est le cas, faux sinon
     */
    pageLoadingIsOver(): boolean {
        return this.congratulationLetter !== undefined;
    }

    /**
     * Vérifie s'il s'agit d'une lettre que l'utilisateur a rédigé
     * @return vrai si la lettre a été rédigée par l'utilisateur, faux sinon
     */
    isWrittenLetter(): boolean {
        return this.congratulationLetter.redactor && this.matricule === this.congratulationLetter.redactor.matricule;
    }

    /**
     * Retourne la date du vol, formatée pour l'affichage
     * @param flight le vol dont on souhaite avoir la date formatée
     * @return la date formatée du vol
     */
    getFormatedFlightDate(flight: CongratulationLetterFlightModel): string {
        return this.congratulationLetterService.getFormatedFlightDate(flight);
    }

    /**
     * Retourne la date de dernière modification, formatée pour l'affichage
     * @return la date de dernière modification au format dd/mm/yyyy hh:mm
     */
    getLastUpdateDate(): string {
        return this.datePipe.transform(this.congratulationLetter.lastUpdateDate, 'dd/MM/yyyy HH:mm');
    }

    /**
     * Récupère une chaine de caractère vide si la valeur est null
     * @return une chaine vide, ou la valeur passée en paramètre si celle ci est non null
     */
    getEmptyStringIfNull(value: string) {
        return Utils.getEmptyStringIfNull(value);
    }

    /**
     * Verifie qu'il s'agit bien du mode des lettres reçu
     * @return true s'il s'agit du mode des lettres reçu, false sinon
     */
    isReceivedMode(): boolean {
        return this.congratulationLetter.redactorType !== CongratulationLetterRedactorTypeEnum.PNC
            || !this.congratulationLetter.redactor
            || (this.congratulationLetter.redactor && this.congratulationLetter.redactor.matricule !== this.pnc.matricule);
    }

    /**
     * Corrige le destinataire
     * @param event événement de la page
     */
    fixRecipient(event: Event) {
        event.stopPropagation();
        this.popoverCtrl.create({
            component: FixRecipientComponent,
            componentProps: { congratulationLetter: this.congratulationLetter, pnc: this.pnc, goBack: true },
            cssClass: 'fix-recipient-popover'
        }).then(popover => popover.present());
        this.popoverCtrl.dismiss();
    }

    /**
     * Présente une alerte pour confirmer la suppression de la priorité
     */
    confirmDeleteCongratulationLetter() {
        this.alertCtrl.create({
            header: this.translateService.instant('CONGRATULATION_LETTERS.CONFIRM_DELETE.TITLE'),
            message: this.translateService.instant('CONGRATULATION_LETTERS.CONFIRM_DELETE.MESSAGE'),
            buttons: [
                {
                    text: this.translateService.instant('CONGRATULATION_LETTERS.CONFIRM_DELETE.CANCEL'),
                    role: 'cancel'
                },
                {
                    text: this.translateService.instant('CONGRATULATION_LETTERS.CONFIRM_DELETE.CONFIRM'),
                    handler: () => this.deleteCongratulationLetter()
                }
            ]
        }).then(alert => alert.present());
    }

    /**
     * Efface une lettre de félicitation puis route vers la page d'acceuil des lettres de félicitation du dossier en cours
     */
    deleteCongratulationLetter() {
        this.loadingCtrl.create().then(loading => {
            loading.present();
            this.congratulationLetterService
                .delete(this.congratulationLetter.techId, this.pnc.matricule, this.mode)
                .then(deletedcongratulationLetter => {
                    this.toastService.success(this.translateService.instant('CONGRATULATION_LETTERS.TOAST.DELETE_SUCCESS'));
                    this.events.publish('CongratulationLetter:deleted');
                    this.goToCongratulationList();
                    loading.dismiss();
                }, error => {
                    loading.dismiss();
                });
        });
    }
    /**
     * Redirige vers la page de modification d'une lettre de félicitation
     */
    updateCongratulationLetter() {
        this.router.navigate(['../..', 'create', this.congratulationLetter.techId], { relativeTo: this.activatedRoute });
    }

    /**
     * Vérifie si le PNC est manager
     * @return vrai si le PNC est manager, faux sinon
     */
    isManager(): boolean {
        return this.securityService.isManager();
    }

    /**
     * Vérifie que l'on est en mode connecté
     * @return true si on est en mode connecté, false sinon
     */
    isConnected(): boolean {
        return this.connectivityService.isConnected();
    }

    /**
     * Annule la création/edition de la lettre de félicitation
     * et route vers la page d'acceuil des lettres de félicitation du dossier en cours
     */
    goToCongratulationList() {
        if (this.congratulationLetter && this.sessionService.isActiveUserMatricule(this.pnc.matricule)
            && this.pnc.manager) {
            this.router.navigate(['tabs', 'home', 'congratulation-letter']);
        } else {
            this.router.navigate(['tabs', 'visit', this.sessionService.visitedPnc.matricule, 'congratulation-letter']);
        }
    }
}