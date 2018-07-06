import { SessionService } from './../../services/session.service';
import { SecurityProvider } from './../../providers/security/security';
import { PncHomePage } from './../pnc-home/pnc-home';
import { Component, ViewChild, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavParams, ViewController, App } from 'ionic-angular';
import { SecMobilService } from '../../services/secMobil.service';
import { Nav } from 'ionic-angular';

@Component({
  selector: 'page-authentication',
  templateUrl: 'authentication.html',
})
export class AuthenticationPage implements OnInit {

  loginForm: FormGroup;
  errorMsg: string;
  hideSpinner = true;
  @ViewChild(Nav) nav: Nav;

  constructor(
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    private securityProvider: SecurityProvider,
    private sessionService: SessionService,
    public appCtrl: App,
    private secMobilService: SecMobilService) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.hideSpinner = false;
    this.secMobilService.isAuthenticated().then(() => {
      this.hideSpinner = true;
      this.putAuthenticatedUserInSession();
    },
      error => {
        this.hideSpinner = true;
        console.log('go to authentication page');
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Authentication');
  }

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  sendAuthent() {
    if (this.hideSpinner === true) {
      this.hideSpinner = false;
      this.errorMsg = null;

      const loginValue: string = this.loginForm.value['login'];
      const passwordValue: string = this.loginForm.value['password'];

      // this.secMobilService.init();
      this.secMobilService.authenticate(loginValue, passwordValue).then(x => {
        console.log('sendAuthent ok : ' + x);
        this.putAuthenticatedUserInSession();
      }, error => {
        this.secMobilService.secMobilRevokeCertificate();
        if (error === 'secmobil.incorrect.credentials') {
          this.errorMsg = 'invalid credentials';
        } else if (error === 'secmobil.unknown.error : errSecDefault') {
          this.errorMsg = 'error while contacting the server' + error;
        } else {
          this.errorMsg = 'error while contacting the server' + error;
        }
        this.hideSpinner = true;
      }).catch(
        exception => {
          this.errorMsg = 'error while contacting the server' + exception;
          this.hideSpinner = true;
        }
      );
    }
  }

  putAuthenticatedUserInSession() {
    this.hideSpinner = false;
    console.log('putAuthenticatedUserInSession');
    this.securityProvider.getAuthenticatedUser().then(authenticatedUser => {
      console.log('putAuthenticatedUserInSession : ' + authenticatedUser);
      this.sessionService.authenticatedUser = authenticatedUser;
      this.viewCtrl.dismiss();
      this.appCtrl.getRootNav().push(PncHomePage, { matricule: authenticatedUser });
      this.hideSpinner = true;
    }, error => {
      this.hideSpinner = true;
      console.log('putAuthenticatedUserInSession error: ' + error);
      // this.nav.push(AuthenticationPage);
    });
  }

}
