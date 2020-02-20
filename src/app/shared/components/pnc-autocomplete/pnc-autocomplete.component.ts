import * as $ from 'jquery';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { Subject } from 'rxjs/Rx';

import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';

import { PncModel } from '../../../core/models/pnc.model';
import { ConnectivityService } from '../../../core/services/connectivity/connectivity.service';
import { PncService } from '../../../core/services/pnc/pnc.service';
import { Utils } from '../../utils/utils';
import { AbstractValueAccessor, MakeProvider } from '../abstract-value-accessor';

@Component({
    selector: 'pnc-autocomplete',
    templateUrl: 'pnc-autocomplete.component.html',
    styleUrls: ['./pnc-autocomplete.component.scss'],
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
    @ViewChild('pncInput', { static: false }) pncInput: ElementRef;

    constructor(
        private pncService: PncService,
        private connectivityService: ConnectivityService,
        private keyboard: Keyboard) {
        super();
        /**
         * Action lorsque le clavier s'affiche
         */
        this.keyboard.onKeyboardShow().subscribe(() => {
            if (this.autoCompleteTopPosition !== -1) {
                $(PncAutoCompleteComponent.CDK_OVERLAY_0).css('top', this.autoCompleteTopPosition + 'px');
            }
        });

        /**
         * Action lorsque le clavier disparaît
         */
        this.keyboard.onKeyboardHide().subscribe(() => {
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
        this.searchTerms
            .debounceTime(500)
            .distinctUntilChanged()
            .switchMap(
                term => this.getAutoCompleteDataReturn(term)
            )
            .subscribe(pncList => {
                this.handleAutoCompleteResponse(pncList);
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
     * Vide le champs de saisie
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
     * @param term termes à rechercher pour l'autocomplete
     * @return Liste des pnc retrouvé par l'autocomplete
     */
    getAutoCompleteDataReturn(term: string): Observable<PncModel[]> {
        if (term) {
            return from(this.pncService.pncAutoComplete(term).then(
                data => {
                    return data;
                }).catch(err => {
                    return err;
                })
            );
        } else {
            return Observable.of<PncModel[]>([]);
        }
    }

    /**
     * Gère l'affichage du spinner et force la position de l'autocompléte et affiche une liste de PNC
     * @param pncList la liste de PNC à afficher
     */
    handleAutoCompleteResponse(pncList: PncModel[]) {
        this.autoCompleteRunning = false;
        $(PncAutoCompleteComponent.CDK_OVERLAY_0).css('top', this.autoCompleteTopPosition + 'px');
        this.pncList = Observable.of(pncList);
    }

    /**
     * Sélectionne le Pnc
     * @param pnc pnc sélectionné
     */
    selectPnc(pnc: PncModel) {
        if (this.onSelectPnc && this.onSelectPnc.observers && this.onSelectPnc.observers.length > 0) {
            this.onSelectPnc.emit(pnc);
        } else {
            this.value = pnc;
        }
        this.pncInput.nativeElement.value = ' ';
    }

    /**
     * Vérifique si l'on est online
     */
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
            if ($(PncAutoCompleteComponent.MAT_AUTOCOMPLETE_0).length !== 0) {
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
        this.autoCompleteTopPosition =
            this.autoCompleteTopPosition != -1 ? this.autoCompleteTopPosition : $(PncAutoCompleteComponent.CDK_OVERLAY_0).offset().top;
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
