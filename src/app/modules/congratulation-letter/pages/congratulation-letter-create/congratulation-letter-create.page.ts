import { ConnectivityService } from './../../../../core/services/connectivity/connectivity.service';
import { DateTransform } from './../../../../shared/utils/date-transform';
import { ToastService } from './../../../../core/services/toast/toast.service';
import { CongratulationLetterRedactorTypeEnum } from './../../../../core/enums/congratulation-letter/congratulation-letter-redactor-type.enum';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CongratulationLetterFlightModel } from '../../../../core/models/congratulation-letter-flight.model';
import { CongratulationLetterModel } from '../../../../core/models/congratulation-letter.model';
import { SessionService } from '../../../../core/services/session/session.service';
import { PncModel } from '../../../../core/models/pnc.model';
import { CongratulationLetterService } from '../../../../core/services/congratulation-letter/congratulation-letter.service';
import { NavParams, NavController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../../shared/utils/utils';
import { Subject, Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

@Component({
    selector: 'congratulation-letter-create',
    templateUrl: 'congratulation-letter-create.page.html',
})
export class CongratulationLetterCreatePage {

    pnc: PncModel;

    creationForm: FormGroup;

    congratulationLetter: CongratulationLetterModel;
    originCongratulationLetter: CongratulationLetterModel;

    displayPncSelection: boolean;

    monthsNames;
    flightDateTimeOptions;

    autoCompleteRunning = false;
    searchTerms = new Subject<string>();
    redactorSearchList: Observable<PncModel[]>;
    selectedRedactor: PncModel;

    CongratulationLetterRedactorTypeEnum = CongratulationLetterRedactorTypeEnum;

    readonly AF = 'AF';

    constructor(private navParams: NavParams,
        private navCtrl: NavController,
        private congratulationLetterService: CongratulationLetterService,
        private pncService: PncService,
        private sessionService: SessionService,
        private formBuilder: FormBuilder,
        private toastService: ToastService,
        private alertCtrl: AlertController,
        private dateTransformer: DateTransform,
        private connectivityService: ConnectivityService,
        public translateService: TranslateService
    ) {
        // Traduction des mois
        this.monthsNames = this.translateService.instant('GLOBAL.MONTH.LONGNAME');

        this.initForm();

        this.handlePncSelectionDisplay();

        this.handleAutocompleteSearch();

        this.congratulationLetter = this.buildNewCongratulationLetter();

        // Options du datepicker
        this.flightDateTimeOptions = {
            buttons: [{
                text: this.translateService.instant('GLOBAL.DATEPICKER.CLEAR'),
                handler: () => this.congratulationLetter.flight.theoricalDate = null
            }]
        };

    }

    ionViewDidEnter() {
        if (this.sessionService.visitedPnc) {
            this.pnc = this.sessionService.visitedPnc;
        }

        this.congratulationLetter = this.buildNewCongratulationLetter();

        this.originCongratulationLetter = _.cloneDeep(this.congratulationLetter);
    }

    ionViewCanLeave() {
        if (this.formHasBeenModified()) {
            return this.confirmAbandonChanges();
        } else {
            return true;
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
     * Vérifie si le formulaire a été modifié sans être enregistré
     */
    formHasBeenModified() {
        return Utils.getHashCode(this.originCongratulationLetter) !== Utils.getHashCode(this.congratulationLetter);
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
     * Initialise le formulaire
     */
    initForm() {
        this.creationForm = this.formBuilder.group({
            flightDateControl: ['', Validators.required],
            flightAirlineControl: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(2), Validators.required])],
            flightNumberControl: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(5), Validators.required])],
            letterTypeControl: ['', Validators.required],
            redactorTypeControl: ['', Validators.required],
            verbatimControl: ['', Validators.compose([Validators.required, Validators.maxLength(4000)])],
            redactorAutoCompleteControl: ['']
        });
    }

    /**
     * Gère l'affichage de la sélection du PNC rédacteur. Si le choix "PNC" est sélectionné, on affiche l'outil de sélection du PNC
     */
    handlePncSelectionDisplay() {
        this.creationForm.get('redactorTypeControl').valueChanges.subscribe(redactorType => {
            if (redactorType === CongratulationLetterRedactorTypeEnum.PNC) {
                this.displayPncSelection = true;
                this.clearPncSearch();
            } else {
                this.displayPncSelection = false;
            }
        });
    }

    /**
     * Teste si le chargement des ressources est terminé
     * @return vrai si c'est le cas, faux sinon
     */
    pageLoadingIsOver(): boolean {
        return this.pnc !== undefined;
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
                term => (term ? this.pncService.pncAutoComplete(term, true) : Observable.of<PncModel[]>([]))
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
        this.navCtrl.pop();
    }

    /**
     * Valide la création de la lettre
     */
    submitLetter() {
        this.congratulationLetter.creationDate = new Date();
        this.congratulationLetter.flight.theoricalDate = this.dateTransformer.transformDateStringToIso8601Format(this.congratulationLetter.flight.theoricalDate);

        this.congratulationLetterService.createOrUpdate(this.congratulationLetter).then(congratulationLetter => {
            this.originCongratulationLetter = _.cloneDeep(this.congratulationLetter);
            this.toastService.success(this.translateService.instant('CONGRATULATION_LETTER_CREATE.SUCCESS.LETTER_CREATED'));
            this.navCtrl.pop();
        }, error => { });
    }

    /**
     * Vérifie si le formulaire est valide
     */
    isFormValid(): boolean {
        return this.connectivityService.isConnected() &&
            this.creationForm.valid &&
            (this.congratulationLetter.redactorType !== CongratulationLetterRedactorTypeEnum.PNC || this.congratulationLetter.redactor != null);
    }
}