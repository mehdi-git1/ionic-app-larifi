import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {  NavController, NavParams } from 'ionic-angular'; 
import { HomePage } from '../home/home';
import { SecMobilService } from '../../services/secMobil.service';

@Component({
  selector: 'page-authentication',
  templateUrl: 'authentication.html',
})
export class AuthenticationPage {
  loginForm: FormGroup;
  errorMsg: string;
  hideSpinner = true;

  constructor(public navCtrl: NavController,
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
    })
  }

  sendAuthent() {
    this.hideSpinner = false;
    this.errorMsg = null;

    let loginValue: string = this.loginForm.value['login'];
    let passwordValue: string = this.loginForm.value['password'];

    this.secMobilService.init();
    this.secMobilService.authenticate(loginValue, passwordValue).then(x => {
      this.navCtrl.setRoot(HomePage);
    }, error => {
      this.secMobilService.secMobilRevokeCertificate();
      if (error === 'secmobil.incorrect.credentials') {
        this.errorMsg = "invalid credentials";
      } else if (error === 'secmobil.unknown.error : errSecDefault') {
        this.errorMsg = "error while contacting the server" +error
      } else {
        this.errorMsg = "error while contacting the server" +error
      }
      this.hideSpinner = true;
    }).catch(
      exception => {
        this.errorMsg = "error while contacting the server" + exception;
        this.hideSpinner = true;
      }
      )
  }
}
