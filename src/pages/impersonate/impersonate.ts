import { AuthenticatedUser } from './../../models/authenticatedUser';
import { SessionService } from './../../services/session.service';
import { PncProvider } from './../../providers/pnc/pnc';
import { Utils } from './../../common/utils';
import { PncHomePage } from './../pnc-home/pnc-home';
import { FormGroup, AbstractControl, Validators, FormBuilder } from '@angular/forms';
import { Subject, Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Pnc } from '../../models/pnc';

@Component({
  selector: 'page-impersonate',
  templateUrl: 'impersonate.html',
})
export class ImpersonatePage {

  searchTerms = new Subject<string>();

  autoCompleteForm: FormGroup;
  pncMatriculeControl: AbstractControl;

  pncList: Observable<Pnc[]>;

  selectedPnc: Pnc;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private utils: Utils,
    private pncProvider: PncProvider,
    private sessionService: SessionService,
    private events: Events
  ) {
    this.initForm();
  }

  initForm() {
    this.autoCompleteForm = this.formBuilder.group({
      pncMatriculeControl: [
        '',
        Validators.compose([Validators.minLength(8), Validators.maxLength(8)])
      ]
    });
    this.pncMatriculeControl = this.autoCompleteForm.get('pncMatriculeControl');

    this.initAutocompleteList();
  }

  /**
   * recharge la liste des pnc de l'autocompletion aprés 300ms
   */
  initAutocompleteList() {
    this.pncList = this.searchTerms
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(
        term => (term ? this.pncProvider.pncAutoComplete(term) : Observable.of<Pnc[]>([]))
      )
      .catch(error => {
        return Observable.of<Pnc[]>([]);
      });
  }

  /**
  * Redirige vers la page d'accueil
  * @param pnc le pnc sélectionné
  */
  openPncHomePage(pnc: Pnc) {
    this.navCtrl.push(PncHomePage, { matricule: pnc.matricule });
  }

  /**
  * Ajoute un terme au flux
  * @param term le terme à ajouter
  */
  searchAutoComplete(term: string): void {
    term = this.utils.replaceSpecialCharacters(term);
    if (!/^[a-zA-Z0-9-]+$/.test(term)) {
      this.pncMatriculeControl.setValue(term.substring(0, term.length - 1));
    } else {
      this.pncMatriculeControl.setValue(term);
      this.searchTerms.next(term);
    }
  }

  /**
  * Affiche le PN dans l'autocomplete
  *  @param pn le PN sélectionné
  */
  displayPnc(pnc: Pnc) {
    return pnc
      ? pnc.firstName + ' ' + pnc.lastName + ' (' + pnc.matricule + ')'
      : pnc;
  }

  /**
   * Lance le processus permettant de se faire passer pour un PNC
   * @param pnc Le pnc qu'on souhaite impersonnifier
   */
  impersonatePnc(pnc: Pnc) {
    const impersonatedPnc = new AuthenticatedUser();
    impersonatedPnc.matricule = pnc.matricule;
    this.sessionService.impersonatedPnc = impersonatedPnc;
    this.events.publish('user:authenticated');
  }

}
