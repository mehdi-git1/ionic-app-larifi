import { Component, Input } from '@angular/core';
import { CongratulationLetterModel } from '../../../../core/models/congratulation-letter.model';
import { PncCardComponent } from '../../../../shared/components/pnc-card/pnc-card.component';
import { PncModel } from '../../../../core/models/pnc.model';
import { NavParams, ViewController } from 'ionic-angular';
import { CongratulationLetterService } from '../../../../core/services/congratulation-letter/congratulation-letter.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { Utils } from '../../../../shared/utils/utils';
import { PncSearchFilterComponent } from '../../../pnc-team/components/pnc-search-filter/pnc-search-filter.component';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import $ from 'jquery';
import { PncService } from '../../../../core/services/pnc/pnc.service';

@Component({
    selector: 'fix-recipient',
    templateUrl: 'fix-recipient.component.html'
})
export class FixRecipientComponent {
    private static CDK_OVERLAY_0 = '#cdk-overlay-0';
    private static MAT_AUTOCOMPLETE_0 = '#mat-autocomplete-0';
    congratulationLetter: CongratulationLetterModel;
    pnc: PncModel;
    selectedPnc: PncModel;
    searchTerms = new Subject<string>();
    pncList: Observable<PncModel[]>;
    // Définit la position top de la liste d'autocomplete
    autoCompleteTopPosition = -1;
    autoCompleteRunning: boolean;

    constructor(private navParams: NavParams,
        public congratulationLetterService: CongratulationLetterService,
        public translateService: TranslateService,
        private toastService: ToastService,
        public viewCtrl: ViewController,
        private pncProvider: PncService) {
        this.congratulationLetter = this.navParams.get('congratulationLetter');
        this.pnc = this.navParams.get('pnc');
      }

    cancel() {
        this.viewCtrl.dismiss();
    }

    fixRecipient() {

    }

    /**
    * recharge la liste des pnc de l'autocompletion aprés 500ms
    */
    initAutocompleteList() {
        this.pncList = this.searchTerms
        .debounceTime(500)
        .distinctUntilChanged()
        .switchMap(
            term => this.getAutoCompleteDataReturn(term)
        )
        .catch(error => {
            this.autoCompleteRunning = false;
            return Observable.of<PncModel[]>([]);
        });
    }

    /**
     * Gére plus finement le retour de l'autocomplete
     * => Permet de gérer l'affichage du spinner et de forcer la position de l'autocompléte
     * @param term termes à rechercher pour l'autocomplete
     * @return Liste des pnc retrouvé par l'autocomplete
     */
    getAutoCompleteDataReturn(term: string): Observable<PncModel[]> {
        if (term) {
        return from(this.pncProvider.pncAutoComplete(term).then(
            data => {
            this.autoCompleteRunning = false;
            $(FixRecipientComponent.CDK_OVERLAY_0).css('top', this.autoCompleteTopPosition + 'px');
            return data;
            }));
        } else {
        this.autoCompleteRunning = false;
        return Observable.of<PncModel[]>([]);
        }
    }

    selectPnc(value: any) {

    }

    /**
    * Ajoute un terme au flux
    * @param term le terme à ajouter
    */
    searchAutoComplete(term: string): void {
        this.checkIfAutoCompleteIsOpen();
        term = Utils.replaceSpecialCaracters(term);
        this.autoCompleteRunning = true;
        this.searchTerms.next(term);
    }

    /**
     * Vérifie toutes les 200ms que l'element d'autocomplete existe
     */
    checkIfAutoCompleteIsOpen() {
        setTimeout(() => {
        if ($(FixRecipientComponent.MAT_AUTOCOMPLETE_0).length != 0) {
            this.changeHeightOnOpen();
        } else {
            this.checkIfAutoCompleteIsOpen();
        }
        }, 200);
    }

    /**
     * Change la max-height de l'autocomplete en fonction de la taille de l'affichage disponible
     */
    changeHeightOnOpen() {
        this.autoCompleteTopPosition = this.autoCompleteTopPosition != -1 ? this.autoCompleteTopPosition : $(FixRecipientComponent.CDK_OVERLAY_0).offset().top;
        $(FixRecipientComponent.CDK_OVERLAY_0).css('top', this.autoCompleteTopPosition + 'px');
        $(FixRecipientComponent.MAT_AUTOCOMPLETE_0).css('max-height', window.innerHeight - this.autoCompleteTopPosition + 'px');
    }
}