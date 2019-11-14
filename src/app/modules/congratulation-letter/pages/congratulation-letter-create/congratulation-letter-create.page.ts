import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { pairwise } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
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
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { FormCanDeactivate } from '../../../../routing/guards/form-changes.guard';
import { DateTransform } from '../../../../shared/utils/date-transform';
import { Utils } from '../../../../shared/utils/utils';

@Component({
    selector: 'congratulation-letter-create',
    templateUrl: 'congratulation-letter-create.page.html',
    styleUrls: ['./congratulation-letter-create.page.scss']
})
export class CongratulationLetterCreatePage extends FormCanDeactivate {

    pnc: PncModel;
    creationMode = true;
    submitInProgress = false;
    congratulationLetterForm: FormGroup;

    congratulationLetter: CongratulationLetterModel;
    originCongratulationLetter: CongratulationLetterModel;

    displayPncSelection: boolean;

    flightDateTimeOptions;

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
        private location: Location,
        private congratulationLetterService: CongratulationLetterService,
        private pncService: PncService,
        private sessionService: SessionService,
        private formBuilder: FormBuilder,
        private toastService: ToastService,
        private alertCtrl: AlertController,
        private dateTransformer: DateTransform,
        private connectivityService: ConnectivityService,
        private datePipe: DatePipe,
        public translateService: TranslateService
    ) {
        super();
        this.initForm();

        this.handlePncSelectionDisplay();

        this.handleAutocompleteSearch();

        // Options du datepicker
        this.flightDateTimeOptions = {
            buttons: [{
                text: this.translateService.instant('GLOBAL.DATEPICKER.CLEAR'),
                handler: () => this.congratulationLetter.flight.theoricalDate = null
            }]
        };

    }

    ngOnInit() {

        if (this.sessionService.visitedPnc) {
            this.pnc = this.sessionService.visitedPnc;
        }

        if (this.activatedRoute.snapshot.paramMap.get('congratulationLetterId')
            && this.activatedRoute.snapshot.paramMap.get('congratulationLetterId') !== '0') {
            // Mode édition
            this.creationMode = false;
            this.congratulationLetterService.getCongratulationLetter(
                parseInt(this.activatedRoute.snapshot.paramMap.get('congratulationLetterId'), 10))
                .then(congratulationLetter => {
                    this.congratulationLetter = congratulationLetter;
                    if (this.congratulationLetter.redactorType === CongratulationLetterRedactorTypeEnum.PNC) {
                        this.selectedRedactor = this.congratulationLetter.redactor;
                        this.displayPncSelection = true;
                    }
                    this.originCongratulationLetter = _.cloneDeep(this.congratulationLetter);
                });
        } else {
            // Mode création
            this.creationMode = true;
            this.displayPncSelection = true;
            this.congratulationLetter = this.buildNewCongratulationLetter();
            this.originCongratulationLetter = _.cloneDeep(this.congratulationLetter);
        }
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
        congratulationLetter.concernedPncs.push(this.pnc);

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
            verbatimControl: [''],
            redactorAutoCompleteControl: ['']
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
            .subscribe(([previousRedactorType, newRedactorType]: [CongratulationLetterRedactorTypeEnum, CongratulationLetterRedactorTypeEnum]) => {
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
            .debounceTime(300)
            .distinctUntilChanged()
            .switchMap(
                term => {
                    if (term) {
                        this.autoCompleteInProgress = true;
                        const autoCompletePromise = this.pncService.pncAutoComplete(term, true);
                        // On enchaine 2 then pour atteindre le "finally"
                        autoCompletePromise.then().then(() => { this.autoCompleteInProgress = false; });
                        return autoCompletePromise;
                    } else {
                        return Observable.of<PncModel[]>([]);
                    }
                }
            )
            .catch(error => {
                return Observable.of<PncModel[]>([]);
            });
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
     * Annule la création de la lettre
     */
    cancelCreation() {
        this.location.back();
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
            this.location.back();
        }, error => { }).then(() => {
            this.submitInProgress = false;
        });
    }

    /**
     * Vérifie si le formulaire est valide
     */
    isFormValid(): boolean {
        return this.connectivityService.isConnected() &&
            this.congratulationLetterForm.valid
            && (!Utils.isEmpty(this.congratulationLetterForm.get('verbatimControl').value) || this.congratulationLetter.documents.length > 0)
            && (this.congratulationLetter.redactorType !== CongratulationLetterRedactorTypeEnum.PNC || this.congratulationLetter.redactor != null);
    }


    /**
     * Retourne la date de dernière modification, formatée pour l'affichage
     * @return la date de dernière modification au format dd/mm/yyyy hh:mm
     */
    getLastUpdateDate(): string {
        return this.datePipe.transform(this.congratulationLetter.lastUpdateDate, 'dd/MM/yyyy HH:mm');
    }

    /**
     * Teste si le verbatim peut être modifié.<br>
     * Le verbatim peut être modifié qu'en cas de création, ou de modification quand l'auteur de
     * la modification est le rédacteur de la lettre
     * @return vrai si le verbatim peut être modifié, faux sinon
     */
    verbatimCanBeEdited() {
        return this.creationMode
            || (
                (this.congratulationLetter.redactor !== undefined
                    && this.sessionService.getActiveUser().matricule === this.congratulationLetter.redactor.matricule)
                || (this.congratulationLetter.creationAuthor !== undefined
                    && this.sessionService.getActiveUser().matricule === this.congratulationLetter.creationAuthor.matricule)
            );
    }
}
