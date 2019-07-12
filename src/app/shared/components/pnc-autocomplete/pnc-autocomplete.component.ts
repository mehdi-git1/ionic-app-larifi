import { Component, ElementRef, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { PncModel } from '../../../core/models/pnc.model';
import { Subject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Utils } from '../../utils/utils';
import { from } from 'rxjs/observable/from';
import $ from 'jquery';
import { PncService } from '../../../core/services/pnc/pnc.service';
import { AbstractValueAccessor, MakeProvider } from '../abstract-value-accessor';
import { ConnectivityService } from '../../../core/services/connectivity/connectivity.service';
import { Keyboard } from 'ionic-angular';


@Component({
    selector: 'pnc-autocomplete',
    templateUrl: 'pnc-autocomplete.component.html',
    providers: [MakeProvider(PncAutoCompleteComponent)]
})
export class PncAutoCompleteComponent extends AbstractValueAccessor {
    private static CDK_OVERLAY_0 = '#cdk-overlay-0';
    private static MAT_AUTOCOMPLETE_0 = '#mat-autocomplete-0';
    searchTerms = new Subject<string>();
    pncList: Observable<PncModel[]>;
    // Définit la position top de la liste d'autocomplete
    autoCompleteTopPosition = -1;
    autoCompleteRunning: boolean;
    removable = true;
    @Output() onSelectPnc: EventEmitter<any> = new EventEmitter();
    @ViewChild('pncInput') pncInput: ElementRef;

    constructor(private pncService: PncService, 
            private connectivityService: ConnectivityService,
            private keyboard: Keyboard) {
        super();
            /**
     * Action lorsque le clavier s'affiche
     */
    this.keyboard.didShow.subscribe(() => {
        if (this.autoCompleteTopPosition != -1) {
          $(PncAutoCompleteComponent.CDK_OVERLAY_0).css('top', this.autoCompleteTopPosition + 'px');
        }
      });

      /**
       * Action lorsque le clavier disparaît
       */
      this.keyboard.didHide.subscribe(() => {
        const newHeight = window.innerHeight - this.autoCompleteTopPosition;
        $(PncAutoCompleteComponent.CDK_OVERLAY_0).css('top', this.autoCompleteTopPosition + 'px');
        setTimeout(() => { $(PncAutoCompleteComponent.MAT_AUTOCOMPLETE_0).css('max-height', newHeight + 'px'); }, 5000);
      });
        this.initAutocompleteList();
    }

    /**
     * Recharge la liste des pncs de l'autocompletion aprés 500ms
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
     * Vérifie si un Pnc a été séléctionné
     * @return true si un Pnc a été séléctionné, false sinon
     */
    pncHasBeenSelected(): boolean {
        return this.value && this.value !== undefined && this.value.matricule != null;
    }

    /**
     *
     */
    clearPncSearch() {
        this.pncInput.nativeElement.value = '';
    }

    /**
     * Déselectionne le Pnc
     */
    deselectPnc() {
        this.value = null;
    }

    /**
     * Gére plus finement le retour de l'autocomplete
     * => Permet de gérer l'affichage du spinner et de forcer la position de l'autocompléte
     * @param term termes à rechercher pour l'autocomplete
     * @return Liste des pnc retrouvé par l'autocomplete
     */
    getAutoCompleteDataReturn(term: string): Observable<PncModel[]> {
        if (term) {
        return from(this.pncService.pncAutoComplete(term).then(
            data => {
            this.autoCompleteRunning = false;
            $(PncAutoCompleteComponent.CDK_OVERLAY_0).css('top', this.autoCompleteTopPosition + 'px');
            return data;
            }));
        } else {
        this.autoCompleteRunning = false;
        return Observable.of<PncModel[]>([]);
        }
    }

    /**
     * Sélectionne le Pnc
     * @param pnc pnc sélectionné
     */
    selectPnc(pnc: PncModel) {
        if (this.onSelectPnc && this.onSelectPnc.observers && this.onSelectPnc.observers.length > 0) {
            this.onSelectPnc.emit(pnc);
        }
        else {
            this.value = pnc;
        }
        this.pncInput.nativeElement.value = ' ';
    }

    areFiltersDisabled(): boolean {
        return !this.connectivityService.isConnected();
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
        if ($(PncAutoCompleteComponent.MAT_AUTOCOMPLETE_0).length != 0) {
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
        this.autoCompleteTopPosition = this.autoCompleteTopPosition != -1 ? this.autoCompleteTopPosition : $(PncAutoCompleteComponent.CDK_OVERLAY_0).offset().top;
        $(PncAutoCompleteComponent.CDK_OVERLAY_0).css('top', this.autoCompleteTopPosition + 'px');
        $(PncAutoCompleteComponent.MAT_AUTOCOMPLETE_0).css('max-height', window.innerHeight - this.autoCompleteTopPosition + 'px');
    }

    /**
     * Affiche le PN dans l'autocomplete
     *  @param pn le PN sélectionné
     */
    displayPnc(pnc: PncModel) {
        return pnc
        ? pnc.firstName + ' ' + pnc.lastName + ' (' + pnc.matricule + ')'
        : pnc;
    }
}