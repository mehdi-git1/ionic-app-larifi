import * as moment from 'moment';
import { HaulTypeEnum } from 'src/app/core/enums/haul-type.enum';
import { SpecialityEnum } from 'src/app/core/enums/speciality.enum';
import { DeviceService } from 'src/app/core/services/device/device.service';

import { ChangeDetectorRef, Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AppConstant } from '../../../../app.constant';
import {
    BusinessIndicatorCommentTypeEnum
} from '../../../../core/enums/business-indicators/business-indicator-comment-type.enum';
import {
    EScoreCommentVerbatimEnum
} from '../../../../core/enums/business-indicators/escore-comment-verbatim.enum';
import {
    ShortLoopCommentVerbatimEnum
} from '../../../../core/enums/business-indicators/short-loop-comment-verbatim.enum';
import {
    BusinessIndicatorModel
} from '../../../../core/models/business-indicator/business-indicator.model';
import {
    EScoreCommentModel
} from '../../../../core/models/business-indicator/e-score-comment.model';
import {
    ShortLoopCommentModel
} from '../../../../core/models/business-indicator/short-loop-comment.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { AlertDialogService } from '../../../../core/services/alertDialog/alert-dialog.service';
import {
    OnlineBusinessIndicatorService
} from '../../../../core/services/business-indicator/online-business-indicator.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { Utils } from '../../../../shared/utils/utils';
import {
    BusinessIndicatorPerfopsLegendComponent
} from '../../components/business-indicator-perfops-legend/business-indicator-perfops-legend.component';

const ratingImagePath = 'assets/imgs/business-indicators/smiley-note-';

@Component({
    selector: 'page-business-indicator-detail',
    templateUrl: 'business-indicator-detail.page.html',
    styleUrls: ['./business-indicator-detail.page.scss']
})
export class BusinessIndicatorDetailPage {

    pnc: PncModel;
    businessIndicator: BusinessIndicatorModel;
    shortLoopCommentsDataSource: MatTableDataSource<ShortLoopCommentModel>;
    eScoreCommentsDataSource: MatTableDataSource<EScoreCommentModel>;
    escoreCommentColumns: string[] = ['rating', 'positiveFeedbackReason', 'negativeFeedbackReason', 'suggestions'];
    shortLoopCommentColumns: string[] = ['rating', 'positiveFeedbackReason', 'negativeFeedbackReason'];
    reportVerbatimMode = false;

    // On expose le composant pour le passer en input du composant edospnc-expandable-content dans le template html
    BusinessIndicatorPerfopsLegendComponent = BusinessIndicatorPerfopsLegendComponent;
    BusinessIndicatorCommentTypeEnum = BusinessIndicatorCommentTypeEnum;
    EScoreCommentVerbatimEnum = EScoreCommentVerbatimEnum;
    ShortLoopCommentVerbatimEnum = ShortLoopCommentVerbatimEnum;

    constructor(
        private activatedRoute: ActivatedRoute,
        private pncService: PncService,
        private onlineBusinessIndicatorService: OnlineBusinessIndicatorService,
        private screenOrientation: ScreenOrientation,
        private changeDetectorRef: ChangeDetectorRef,
        private deviceService: DeviceService,
        private alertDialogService: AlertDialogService,
        private translateService: TranslateService,
        private toastService: ToastService,
        private loadingCtrl: LoadingController
    ) {
        if (!this.deviceService.isBrowser()) {
            this.detectOrientation();
        }

        const matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
        const id = +this.activatedRoute.snapshot.paramMap.get('id');
        this.pncService.getPnc(matricule).then(pnc => {
            this.pnc = pnc;
        });
        this.onlineBusinessIndicatorService.getBusinessIndicator(id).then(businessIndicator => {
            this.businessIndicator = businessIndicator;
            const eScoreCommentsFiltered = this.filterValidEScoreComments(businessIndicator.escoreComments);
            eScoreCommentsFiltered.sort((escoreComment, otherEscoreComment) => {
                return this.sortEscoreCommentByRating(escoreComment, otherEscoreComment);
            });
            this.eScoreCommentsDataSource = new MatTableDataSource<EScoreCommentModel>(eScoreCommentsFiltered);
            const shortLoopCommentsFiltered = this.filterValidShortLoopComments(businessIndicator.shortLoopComments);
            shortLoopCommentsFiltered.sort((shortLoopComment, otherShortLoopComment) => {
                return this.sortShortLoopCommentCommentByRating(shortLoopComment, otherShortLoopComment);

            });
            this.shortLoopCommentsDataSource = new MatTableDataSource<ShortLoopCommentModel>(shortLoopCommentsFiltered);
        });
    }

    /**
     * Tri décroissant des commentaires eScore par note
     * @param escoreComment commentaire eScore de base
     * @param otherEscoreComment commentaire eScore à comparer
     */
    sortEscoreCommentByRating(escoreComment: EScoreCommentModel, otherEscoreComment: EScoreCommentModel): number {
        return escoreComment.rating < otherEscoreComment.rating ? 1 : -1;
    }

    /**
     * Tri décroissant des commentaires boucle courte par note
     * @param shortLoopComment commentaire boucle courte de base
     * @param otherShortLoopComment commentaire boucle courte à comparer
     */
    sortShortLoopCommentCommentByRating(shortLoopComment: ShortLoopCommentModel, otherShortLoopComment: ShortLoopCommentModel): number {
        return shortLoopComment.rating < otherShortLoopComment.rating ? 1 : -1;
    }

    /**
     * Filter les commentaires eScore valides
     * @param escoreComments tableau de commentaires eScore
     * @return tableau de commentaires eScore valides
     */
    filterValidEScoreComments(escoreComments: Array<EScoreCommentModel>) {
        return escoreComments.filter(
            escoreComment =>
                !(Utils.isEmpty(escoreComment.positivePersonalFeedbackReason) &&
                    Utils.isEmpty(escoreComment.negativePersonalFeedbackReason) &&
                    Utils.isEmpty(escoreComment.suggestions))
        );
    }

    /**
     * Filter les commentaires boucle courte valides
     * @param shortLoopComments tableau de commentaires boucle courte
     * @return tableau de commentaires boucle courte valides
     */
    filterValidShortLoopComments(shortLoopComments: Array<ShortLoopCommentModel>) {
        return shortLoopComments.filter(
            shortLoopComment =>
                !(Utils.isEmpty(shortLoopComment.appreciatedPoints) &&
                    Utils.isEmpty(shortLoopComment.pointsToImprove))
        );
    }

    /**
     * Vérifie si le PNC est CC LC sur le vol courant
     * @return vrai si c'est le cas, faux sinon
     */
    isCcLc() {
        return this.businessIndicator.aboardSpeciality === SpecialityEnum.CC
            && this.businessIndicator.flight.haulType === HaulTypeEnum.LC;
    }

    /**
     * Calcule la date de départ plannifiée du vol d'un indicateur métier : date de départ du tronçon - d0
     * @param businessIndicator l'indicateur métier du vol dont on souhaite calculer la date planifiée
     * @return la date de départ planifiée du vol
     */
    getPlannedDepartureDate(businessIndicator: BusinessIndicatorModel): Date {
        return moment(businessIndicator.flight.legDepartureDate, AppConstant.isoDateFormat)
            .subtract(businessIndicator.flight.d0, 'minutes').toDate();
    }

    /**
     * Calcule le départ navette D0 (on enlève 5 minutes)
     * @return le départ navette D0
     */
    getShuttleDepartureD0(): number {
        return this.businessIndicator.flight.operatingPerformance.shuttleDeparture;
    }

    /**
     * Vérifie si un indicateur est considéré comme "à l'heure" (inférieur ou égal à 0)
     * @param value la valeur à tester
     * @return vrai si c'est le cas, faux sinon
     */
    isOnTime(value: any): boolean {
        return +value <= 0;
    }

    /**
     * Vérifie si une valeur est considérée comme vide (égale à 0)
     * @param value la valeur à tester
     * @return vrai si c'est le cas, faux sinon
     */
    isEmptyOrZero(value: any): boolean {
        return !value || value === '0';
    }

    /**
     * Vérifie si une valeur est présente
     * @param value la valeur à tester
     * @return vrai si c'est le cas, faux sinon
     */
    exists(value: any): boolean {
        return value !== undefined;
    }

    /**
     * Retourne la valeur absolue du nombre
     * @param value le nombre à transformer
     * @return la valeur absolue du nombre
     */
    absoluteValue(value: number): number {
        return Math.abs(value);
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.pnc !== undefined && this.businessIndicator !== undefined;
    }

    /**
     * Crée le chemin vers le fichier de l'icone de note escore
     * @param rating note
     * @return le chemin vers le fichier de l'icone
     */
    getEscoreCommentRatingImagePath(rating: number) {
        return ratingImagePath + rating * 10 + '.svg';
    }

    /**
     * Crée un tableau vide de la taille du paramètre rating
     * @param rating note
     * @return le tableau
     */
    getRatingArray(rating: number): Array<any> {
        if (!rating || rating <= 0) {
            return new Array();
        }
        return new Array(rating);
    }

    /**
     * Détermine si les commentaires boucles courte sont affichés ou pas
     * (en fonction de la spécialité du Pnc à bord et du type de vol)
     * @return true si on doit les afficher, false sinon
     */
    canDisplayShortLoopComment(): boolean {
        const isCcpAndLcFlight = this.businessIndicator.aboardSpeciality === SpecialityEnum.CCP
            && this.businessIndicator.flight.haulType === HaulTypeEnum.LC;
        const isCcAndCcOrMcFlight = this.businessIndicator.aboardSpeciality === SpecialityEnum.CC
            && (this.businessIndicator.flight.haulType === HaulTypeEnum.CC
                || this.businessIndicator.flight.haulType === HaulTypeEnum.MC);
        return isCcpAndLcFlight || isCcAndCcOrMcFlight;
    }

    /**
     * Détecte le changement d'orientation (portrait ou paysage)
     */
    detectOrientation() {
        this.screenOrientation.onChange().subscribe(() => {
            this.changeDetectorRef.detectChanges();
        });
    }

    /**
     * Active/désactive le mode "signaler un verbatim abusif"
     */
    toggleReportVerbatimMode() {
        this.reportVerbatimMode = !this.reportVerbatimMode;
    }

    /**
     * Demande une confirmation à l'utilisateur avant de signaler un verbatim
     * @param eScoreComment le commentaire contenant le verbatim à signaler
     * @param commentVerbatim le type de verbatim à signaler
     * @param verbatim le verbatim jugé abusif
     * @param verbatimReported si le verbatim est déjà signalé
     */
    async confirmReportEScoreCommentVerbatim(
        eScoreComment: EScoreCommentModel, commentVerbatim: EScoreCommentVerbatimEnum, verbatim: string, verbatimReported: boolean) {
        // On ne fait quelque chose que si le verbatim peut être signalé
        if (this.canBeReported(verbatim, verbatimReported)) {
            const alert = await this.alertDialogService.openAlertDialog(
                this.translateService.instant('BUSINESS_INDICATORS.DETAIL.REPORT_VERBATIM.CONFIRM_REPORT_MODAL.TITLE'),
                this.translateService.instant('BUSINESS_INDICATORS.DETAIL.REPORT_VERBATIM.CONFIRM_REPORT_MODAL.CONTENT',
                    { verbatim: verbatim }),
                this.translateService.instant('GLOBAL.BUTTONS.CONFIRM'),
                this.translateService.instant('GLOBAL.BUTTONS.CANCEL'),
                'report-verbatim-confirm-alert'
            );
            alert.onDidDismiss().then(value => {
                if (value.role === 'confirm') {
                    this.reportEScoreCommentVerbatim(eScoreComment, commentVerbatim);
                    this.reportVerbatimMode = false;
                }
            });
        }
    }

    /**
     * Signale le verbatim d'un commentaire eScore
     * @param eScoreComment le commentaire contenant le verbatim à signaler
     * @param commentVerbatim le type de verbatim à signaler
     */
    reportEScoreCommentVerbatim(eScoreComment: EScoreCommentModel, commentVerbatim: EScoreCommentVerbatimEnum) {
        this.loadingCtrl.create({ message: this.translateService.instant('GLOBAL.PLEASE_WAIT') })
            .then((loading) => {
                loading.present();
                this.onlineBusinessIndicatorService.reportEScoreCommentVerbatim(eScoreComment.techId, commentVerbatim)
                    .then((eScoreCommentUpdated) => {
                        // Mise à jour du commentaire de la dataSource pour mise à jour dans l'IHM
                        for (let i = 0; i < this.eScoreCommentsDataSource.data.length; i++) {
                            if (this.eScoreCommentsDataSource.data[i].techId === eScoreCommentUpdated.techId) {
                                this.eScoreCommentsDataSource.data[i] = eScoreCommentUpdated;
                            }
                        }
                        this.eScoreCommentsDataSource = new MatTableDataSource<EScoreCommentModel>(this.eScoreCommentsDataSource.data);
                        this.changeDetectorRef.detectChanges();
                        this.toastService.success(
                            this.translateService.instant('BUSINESS_INDICATORS.DETAIL.REPORT_VERBATIM.VERBATIM_REPORTED'));
                    }).finally(() => loading.dismiss());
            });
    }

    /**
     * Demande une confirmation à l'utilisateur avant de signaler un verbatim
     * @param shortLoopComment le commentaire contenant le verbatim à signaler
     * @param commentVerbatim le type de verbatim à signaler
     * @param verbatim le verbatim jugé abusif
     * @param verbatimReported si le verbatim est déjà signalé
     */
    async confirmReportShortLoopCommentVerbatim(
        shortLoopComment: ShortLoopCommentModel, commentVerbatim: ShortLoopCommentVerbatimEnum, verbatim: string, verbatimReported: boolean) {
        // On ne fait quelque chose que si le verbatim peut être signalé
        if (this.canBeReported(verbatim, verbatimReported)) {
            const alert = await this.alertDialogService.openAlertDialog(
                this.translateService.instant('BUSINESS_INDICATORS.DETAIL.REPORT_VERBATIM.CONFIRM_REPORT_MODAL.TITLE'),
                this.translateService.instant('BUSINESS_INDICATORS.DETAIL.REPORT_VERBATIM.CONFIRM_REPORT_MODAL.CONTENT',
                    { verbatim: verbatim }),
                this.translateService.instant('GLOBAL.BUTTONS.CONFIRM'),
                this.translateService.instant('GLOBAL.BUTTONS.CANCEL'),
                'report-verbatim-confirm-alert'
            );
            alert.onDidDismiss().then(value => {
                if (value.role === 'confirm') {
                    this.reportShortLoopCommentVerbatim(shortLoopComment, commentVerbatim);
                    this.reportVerbatimMode = false;
                }
            });
        }
    }

    /**
     * Signale le verbatim d'un commentaire boucle courte
     * @param shortLoopComment le commentaire contenant le verbatim à signaler
     * @param commentVerbatim le type de verbatim à signaler
     */
    reportShortLoopCommentVerbatim(shortLoopComment: ShortLoopCommentModel, commentVerbatim: ShortLoopCommentVerbatimEnum) {
        this.loadingCtrl.create({ message: this.translateService.instant('GLOBAL.PLEASE_WAIT') })
            .then((loading) => {
                loading.present();
                this.onlineBusinessIndicatorService.reportShortLoopCommentVerbatim(shortLoopComment.techId, commentVerbatim)
                    .then((shortLoopCommentUpdated) => {
                        // Mise à jour du commentaire de la dataSource pour mise à jour dans l'IHM
                        for (let i = 0; i < this.shortLoopCommentsDataSource.data.length; i++) {
                            if (this.shortLoopCommentsDataSource.data[i].techId === shortLoopCommentUpdated.techId) {
                                this.shortLoopCommentsDataSource.data[i] = shortLoopCommentUpdated;
                            }
                        }
                        this.shortLoopCommentsDataSource =
                            new MatTableDataSource<ShortLoopCommentModel>(this.shortLoopCommentsDataSource.data);
                        this.changeDetectorRef.detectChanges();
                        this.toastService.success(this.translateService.instant(
                            'BUSINESS_INDICATORS.DETAIL.REPORT_VERBATIM.VERBATIM_REPORTED'));
                    }).finally(() => loading.dismiss());
            });
    }

    /**
     * Vérifie qu'un verbatim peut être signalé. Pour cela, le mode "signalement" doit être activé et le verbatim
     * ne doit pas être vide ni déjà signalé
     * @param verbatim le verbatim à vérifier
     * @param verbatimReported si le verbatim est déjà signalé
     * @return vrai si le verbatim peut être signalé, faux sinon
     */
    canBeReported(verbatim: string, verbatimReported: boolean): boolean {
        return this.reportVerbatimMode && !Utils.isEmpty(verbatim) && !verbatimReported;
    }

    /**
     * Retourne le nombre de KDO (somme des KDO et gift for care)
     * @return le nombre de KDO
     */
    getKdoCount(): number {
        return this.businessIndicator.kdo + this.businessIndicator.giftForCare;
    }
}
