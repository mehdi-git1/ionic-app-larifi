import { PncHomePage } from './../pnc-home/pnc-home';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {  NavParams } from 'ionic-angular';
import { SecMobilService } from '../../services/secMobil.service';
import { Nav } from 'ionic-angular';

@Component({
  selector: 'page-authentication',
  templateUrl: 'authentication.html',
})
export class AuthenticationPage {
  loginForm: FormGroup;
  errorMsg: string;
  hideSpinner = true;
  @ViewChild(Nav) nav: Nav;

  constructor(
    public navParams: NavParams,
    private secMobilService: SecMobilService) {
    this.initializeForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Authentication');
  }

  initializeForm() {
    this.loginForm = new FormGroup({
      login: new FormControl('login'),
      password: new FormControl('password')
    });
  }

  sendAuthent() {
    if ( this.hideSpinner === true) {
      this.hideSpinner = false;
      this.errorMsg = null;

      const loginValue: string = this.loginForm.value['login'];
      const passwordValue: string = this.loginForm.value['password'];

      // this.secMobilService.init();
      this.secMobilService.authenticate(loginValue, passwordValue).then(x => {
        this.nav.setRoot(PncHomePage);
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
}
