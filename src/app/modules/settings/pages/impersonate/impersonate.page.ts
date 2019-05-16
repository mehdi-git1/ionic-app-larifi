import { AuthenticationService } from './../../../../core/authentication/authentication.service';
import { Utils } from './../../../../shared/utils/utils';
import { SecurityService } from '../../../../core/services/security/security.service';
import { AuthenticatedUserModel } from '../../../../core/models/authenticated-user.model';
import { SessionService } from '../../../../core/services/session/session.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { PncHomePage } from '../../../home/pages/pnc-home/pnc-home.page';
import { FormGroup, AbstractControl, Validators, FormBuilder } from '@angular/forms';
import { Subject, Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { PncModel } from '../../../../core/models/pnc.model';

@Component({
  selector: 'page-impersonate',
  templateUrl: 'impersonate.page.html',
})
export class ImpersonatePage {

  searchTerms = new Subject<string>();

  autoCompleteForm: FormGroup;
  pncMatriculeControl: AbstractControl;

  pncList: Observable<PncModel[]>;

  selectedPnc: PncModel;
  impersonatingInProgress = false;

  constructor(private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private pncProvider: PncService,
    private securityProvider: SecurityService,
    private events: Events,
    public sessionService: SessionService,
    public authenticationService: AuthenticationService
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
        term => (term ? this.pncProvider.pncAutoComplete(term, true) : Observable.of<PncModel[]>([]))
      )
      .catch(error => {
        return Observable.of<PncModel[]>([]);
      });
  }

  /**
  * Redirige vers la page d'accueil
  * @param pnc le pnc sélectionné
  */
  openPncHomePage(pnc: PncModel) {
    this.navCtrl.push(PncHomePage, { matricule: pnc.matricule });
  }

  /**
  * Ajoute un terme au flux
  * @param term le terme à ajouter
  */
  searchAutoComplete(term: string): void {
    this.searchTerms.next(Utils.replaceSpecialCaracters(term));
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
  displayPnc(pnc: PncModel) {
    return pnc
      ? pnc.firstName + ' ' + pnc.lastName + ' (' + pnc.matricule + ')'
      : pnc;
  }

  /**
   * Lance le processus permettant de se faire passer pour un PNC
   * @param pnc Le pnc qu'on souhaite impersonnifier
   */
  impersonateUser(pnc: PncModel): void {
    this.impersonatingInProgress = true;
    this.securityProvider.isImpersonationAvailable(pnc.matricule).then(success => {
      const impersonatedUser = new AuthenticatedUserModel();
      impersonatedUser.matricule = pnc.matricule;
      this.sessionService.impersonatedUser = impersonatedUser;
      // On fait la redirection aprés avoir récupéré le user impersonnifié
      this.authenticationService.putAuthenticatedUserInSession().then(
        data => {
          this.events.publish('user:authenticationDone');
          // On redirige vers la page PncHomePage pour permettre le rechargement de celle-ci
          // le popToRoot ne recharge pas la page en rafraichissant les données
          if (this.navCtrl.parent) {
            this.navCtrl.setRoot(PncHomePage);
          } else {
            this.navCtrl.popToRoot();
          }
        }
      );
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
      this.navCtrl.setRoot(PncHomePage);
    }
    this.authenticationService.putAuthenticatedUserInSession().then(
      data => this.events.publish('user:authenticationDone')
    );
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
