import * as _ from 'lodash-es';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, switchMap } from 'rxjs/operators';
import {
    CongratulationLetterModeEnum
} from 'src/app/core/enums/congratulation-letter/congratulation-letter-mode.enum';

import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    AlertController, LoadingController, NavController, PopoverController
} from '@ionic/angular';
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
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { Events } from '../../../../core/services/events/events.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { FormCanDeactivate } from '../../../../routing/guards/form-changes.guard';
import { DateTransform } from '../../../../shared/utils/date-transform';
import { Utils } from '../../../../shared/utils/utils';
import { FixRecipientComponent } from '../../components/fix-recipient/fix-recipient.component';

@Component({
    selector: 'congratulation-letter-create',
    templateUrl: 'congratulation-letter-create.page.html',
    styleUrls: ['./congratulation-letter-create.page.scss']
})
export class CongratulationLetterCreatePage extends FormCanDeactivate implements OnInit {

    mode: CongratulationLetterModeEnum;

    pnc: PncModel;
    creationMode = true;
    submitInProgress = false;
    congratulationLetterForm: FormGroup;

    congratulationLetter: CongratulationLetterModel;
    originCongratulationLetter: CongratulationLetterModel;

    displayPncSelection: boolean;

    autoCompleteInProgress = false;
    searchTerms = new Subject<string>();
    redactorSearchList: Observable<PncModel[]>;
    selectedRedactor: PncModel;

    @ViewChild('form', { static: false }) form: NgForm;

    CongratulationLetterRedactorTypeEnum = CongratulationLetterRedactorTypeEnum;
    TextEditorModeEnum = TextEditorModeEnum;

    readonly AF = 'AF';

    constructor(
        private activatedRoute: ActivatedRoute,
        private congratulationLetterService: CongratulationLetterService,
        private pncService: PncService,
        private sessionService: SessionService,
        private formBuilder: FormBuilder,
        private toastService: ToastService,
        private navCtrl: NavController,
        private dateTransformer: DateTransform,
        private connectivityService: ConnectivityService,
        private datePipe: DatePipe,
        public translateService: TranslateService,
        private popoverCtrl: PopoverController,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private events: Events,
        private router: Router
    ) {
        super();
        this.initForm();

        this.handlePncSelectionDisplay();

        this.handleAutocompleteSearch();
    }

    ngOnInit() {
        let congratulationPromise = null;
        const allPromises = new Array();

        const matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
        const pncPromise = this.pncService.getPnc(matricule);
        allPromises.push(pncPromise);
        pncPromise.then(pnc => {
            this.pnc = pnc;
        }, error => { });

        if (this.activatedRoute.snapshot.paramMap.get('congratulationLetterId')
            && this.activatedRoute.snapshot.paramMap.get('congratulationLetterId') !== '0') {
            // Mode édition
            this.creationMode = false;
            congratulationPromise = this.congratulationLetterService.getCongratulationLetter(
                parseInt(this.activatedRoute.snapshot.paramMap.get('congratulationLetterId'), 10));
            allPromises.push(congratulationPromise);
            congratulationPromise.then(congratulationLetter => {
                this.congratulationLetter = congratulationLetter;
                if (this.isReceivedMode()) {
                    this.mode = CongratulationLetterModeEnum.RECEIVED;
                } else {
                    this.mode = CongratulationLetterModeEnum.WRITTEN;
                }
                // on instancie le verbatim dans le formControl pour pouvoir valider le formulaire
                if (!this.verbatimCanBeEdited()) {
                    this.congratulationLetterForm.get('verbatimControl').setValue(this.congratulationLetter.verbatim);
                }
                if (this.congratulationLetter.redactorType === CongratulationLetterRedactorTypeEnum.PNC) {
                    this.selectedRedactor = this.congratulationLetter.redactor;
                    this.displayPncSelection = true;
                }
            });
        } else {
            // Mode création
            this.creationMode = true;
            this.displayPncSelection = true;
            this.congratulationLetter = this.buildNewCongratulationLetter();
        }

        Promise.all(allPromises).then(() => {
            // On ajoute à la lettre le PNC destinataire de celle ci, après que le PNC et la lettre ont été récupérés
            this.congratulationLetter.concernedPncs.push(this.pnc);
            this.originCongratulationLetter = _.cloneDeep(this.congratulationLetter);
        });
    }

    /**
     * Retourne une nouvelle lettre vierge initialisée avec certains champs
     * @return une lettre vierge
     */
    buildNewCongratulationLetter(): CongratulationLetterModel {
        const congratulationLetter = new CongratulationLetterModel();
        congratulationLetter.airlineOwner = this.AF;
        congratulationLetter.collective = false;
        congratulationLetter.redactorType = CongratulationLetterRedactorTypeEnum.PNC;
        congratulationLetter.flight = new CongratulationLetterFlightModel();
        congratulationLetter.flight.airline = this.AF;
        congratulationLetter.concernedPncs = new Array();

        return congratulationLetter;
    }

    /**
     * Initialise le formulaire
     */
    initForm() {
        this.congratulationLetterForm = this.formBuilder.group({
            flightDateControl: ['', Validators.required],
            flightAirlineControl: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(2)])],
            flightNumberControl: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(5)])],
            letterTypeControl: ['', Validators.required],
            redactorTypeControl: ['', Validators.required],
            verbatimControl: '',
            redactorAutoCompleteControl: ''
        });
    }

    /**
     * Renvoie le mode d'affichage du wiziwig (verbatim)
     * @return FULL pour le mode edition, READ_ONLY pour le mode lecture seule
     */
    getVerbatimMode() {
        if (this.verbatimCanBeEdited()) {
            return TextEditorModeEnum.FULL;
        } else {
            return TextEditorModeEnum.READ_ONLY;
        }
    }

    /**
     * Gère l'affichage de la sélection du PNC rédacteur. Si le choix "PNC" est sélectionné, on affiche l'outil de sélection du PNC
     */
    handlePncSelectionDisplay() {
        this.congratulationLetterForm.get('redactorTypeControl').valueChanges.pipe(pairwise())
            .subscribe(([previousRedactorType, newRedactorType]:
                [CongratulationLetterRedactorTypeEnum, CongratulationLetterRedactorTypeEnum]) => {
                if (newRedactorType === CongratulationLetterRedactorTypeEnum.PNC) {
                    this.displayPncSelection = true;
                } else {
                    this.clearPncSearch();
                    this.displayPncSelection = false;
                }
            });
    }

    /**
     * Teste si le chargement des ressources est terminé
     * @return vrai si c'est le cas, faux sinon
     */
    pageLoadingIsOver(): boolean {
        return this.congratulationLetter && this.congratulationLetter !== undefined;
    }

    /**
     * Ajoute un terme au flux utilisé pour la recherche dynamique
     * @param term le terme à ajouter
     */
    searchAutoComplete(term: string): void {
        this.searchTerms.next(Utils.replaceSpecialCaracters(term));
    }

    /**
     * recharge la liste des pnc de l'autocompletion aprés 300ms
     */
    handleAutocompleteSearch() {
        this.redactorSearchList = this.searchTerms
            .pipe(debounceTime(300), distinctUntilChanged())
            .pipe(switchMap(term => {
                if (term) {
                    this.autoCompleteInProgress = true;
                    const autoCompletePromise = this.pncService.pncAutoComplete(term, true);
                    autoCompletePromise.catch(error => {
                        return of<PncModel[]>([]);
                    })
                    autoCompletePromise.finally(() => { this.autoCompleteInProgress = false; });
                    return autoCompletePromise;
                } else {
                    return of<PncModel[]>([]);
                }
            })
            );
    }

    /**
     * Sélectionne le PNC comme rédacteur de la lettre de félicitations
     * @param redactor le pnc rédacteur de la lettre
     */
    selectPncRedactor(redactor: PncModel) {
        this.congratulationLetter.redactor = redactor;
        this.congratulationLetter.redactorSpeciality = redactor.speciality;
    }

    /**
     * Vide le champs d'autocomplétion
     */
    clearPncSearch(): void {
        this.congratulationLetter.redactor = null;
        this.congratulationLetter.redactorSpeciality = null;
        this.selectedRedactor = null;
    }

    /**
     * Affiche le PN dans l'autocomplete
     * @param pn le PN sélectionné
     * @return le pnc formaté pour l'affichage
     */
    displayPnc(pnc: PncModel) {
        return pnc
            ? pnc.firstName + ' ' + pnc.lastName + ' (' + pnc.matricule + ')'
            : '';
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

    /**
     * Valide la création/modification de la lettre
     */
    submitLetter() {
        this.submitInProgress = true;
        this.congratulationLetter.flight.theoricalDate =
            this.dateTransformer.transformDateStringToIso8601Format(this.congratulationLetter.flight.theoricalDate);

        this.congratulationLetterService.createOrUpdate(this.congratulationLetter).then(congratulationLetter => {
            this.originCongratulationLetter = _.cloneDeep(this.congratulationLetter);
            if (this.creationMode) {
                this.toastService.success(this.translateService.instant('CONGRATULATION_LETTER_CREATE.SUCCESS.LETTER_CREATED'));
            } else {
                this.toastService.success(this.translateService.instant('CONGRATULATION_LETTER_CREATE.SUCCESS.LETTER_UPDATED'));
            }
            this.congratulationLetterForm.markAsPristine();
            this.navCtrl.pop();
        }, error => { }).then(() => {
            this.submitInProgress = false;
        });
    }

    /**
     * Vérifie si le formulaire est valide
     */
    isFormValid(): boolean {
        return this.formHasBeenModified()
            && this.connectivityService.isConnected()
            && this.congratulationLetterForm.valid
            && (!Utils.isEmpty(this.congratulationLetterForm.get('verbatimControl').value)
                || this.congratulationLetter.documents.length > 0)
            && (this.congratulationLetter.redactorType !== CongratulationLetterRedactorTypeEnum.PNC
                || this.congratulationLetter.redactor != null);
    }


    /**
     * Retourne la date de dernière modification, formatée pour l'affichage
     * @return la date de dernière modification au format dd/mm/yyyy hh:mm
     */
    getLastUpdateDate(): string {
        return this.datePipe.transform(this.congratulationLetter.lastUpdateDate, 'dd/MM/yyyy HH:mm');
    }

    /**
     * Teste si le verbatim peut être modifié.
     * Le verbatim peut être modifié qu'en cas de création, ou de modification quand l'auteur de
     * la modification est le rédacteur de la lettre
     * @return vrai si le verbatim peut être modifié, faux sinon
     */
    verbatimCanBeEdited() {
        return this.creationMode || this.isRedactorActiveUser() || this.isCreationAuthorActiveUser();
    }

    /**
     * Teste si le rédacteur de la lettre est l'utilisateur actuel
     */
    isRedactorActiveUser(): boolean {
        if (this.congratulationLetter.redactor === undefined || this.congratulationLetter.redactor === null) {
            return false;
        }
        return this.sessionService.getActiveUser().matricule === this.congratulationLetter.redactor.matricule;
    }

    /**
     * Teste si l'auteur de la lettre est l'utilisateur actuel
     */
    isCreationAuthorActiveUser(): boolean {
        if (this.congratulationLetter.creationAuthor === undefined) {
            return false;
        }
        return this.sessionService.getActiveUser().matricule === this.congratulationLetter.creationAuthor.matricule;
    }

    /**
     * Teste si la lettre de félicitation est en mode création ou édition
     */
    isCreationMode() {
        return this.creationMode;
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
            componentProps: { congratulationLetter: this.congratulationLetter, pnc: this.pnc },
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
                    role: 'cancel',
                    handler: () => this.closePopover()
                },
                {
                    text: this.translateService.instant('CONGRATULATION_LETTERS.CONFIRM_DELETE.CONFIRM'),
                    handler: () => this.deleteCongratulationLetter()
                }
            ]
        }).then(alert => alert.present());
    }

    /**
     * Ferme la popover
     */
    closePopover() {
        this.popoverCtrl.dismiss();
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
     * Vérifie si le formulaire a été modifié sans être enregistré
     */
    formHasBeenModified() {
        return Utils.getHashCode(this.originCongratulationLetter) !== Utils.getHashCode(this.congratulationLetter);
    }
}
