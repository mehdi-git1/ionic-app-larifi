import { SecurityProvider } from './../../providers/security/security';
import { AuthenticatedUser } from './../../models/authenticatedUser';
import { SessionService } from './../../services/session.service';
import { PncProvider } from './../../providers/pnc/pnc';
import { PncHomePage } from './../pnc-home/pnc-home';
import { FormGroup, AbstractControl, Validators, FormBuilder } from '@angular/forms';
import { Subject, Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
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
  impersonatingInProgress = false;

  constructor(private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private pncProvider: PncProvider,
    private securityProvider: SecurityProvider,
    private events: Events,
    public sessionService: SessionService
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
        term => (term ? this.pncProvider.pncAutoComplete(term, true) : Observable.of<Pnc[]>([]))
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
    this.searchTerms.next(term);
  }

  /**
   * Vide le champs d'autocomplétion
   */
  clearPncSearch(): void {
    this.selectedPnc = null;
  }

  /**
  * Affiche le PN dans l'autocomplete
  * @param pn le PN sélectionné
  * @return le pnc formaté pour l'affichage
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
  impersonateUser(pnc: Pnc): void {
    this.impersonatingInProgress = true;
    this.securityProvider.isImpersonationAvailable(pnc.matricule).then(success => {
      const impersonatedUser = new AuthenticatedUser();
      impersonatedUser.matricule = pnc.matricule;
      this.sessionService.impersonatedUser = impersonatedUser;
      if (this.navCtrl.parent) {
        this.navCtrl.parent.select(0);
        this.navCtrl.setRoot(PncHomePage);
      }
      this.events.publish('user:authenticated');
      this.impersonatingInProgress = false;
    }, error => {
      this.impersonatingInProgress = false;
    });
  }

  /**
   * Vérifie si l'utilisateur connecté peut récupérer son identité d'origine
   * @return vrai si c'est le cas, faux sinon
   */
  canGetMyIdentityBack(): boolean {
    return this.sessionService.impersonatedUser !== null && this.sessionService.authenticatedUser.isPnc;
  }

  /**
   * Enclenche la récupération de l'identité d'origine de l'utilisateur connecté en supprimant le PNC impersonnifié
   */
  getMyIdentityBack(): void {
    this.sessionService.impersonatedUser = null;
    if (this.navCtrl.parent) {
      this.navCtrl.parent.select(0);
      this.navCtrl.setRoot(PncHomePage);
    }
    this.events.publish('user:authenticated');
  }

  /**
   * Vérifie que l'utilisateur impersonnifié est complet, afin d'éviter d'afficher des infos incomplètes
   * @return vrai si les infos sont complètes, faux sinon
   */
  isImpersonatedUserComplete() {
    const impersonatedUser = this.sessionService.impersonatedUser;
    return impersonatedUser && impersonatedUser.matricule && impersonatedUser.firstName && impersonatedUser.lastName;
  }
}
