import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Config } from 'src/environments/config';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { AuthenticationStatusEnum } from '../../../../core/enums/authentication-status.enum';
import { AppInitService } from '../../../../core/services/app-init/app-init.service';
import { DeviceService } from '../../../../core/services/device/device.service';
import { ModalSecurityService } from '../../../../core/services/modal/modal-security.service';

@Component({
  selector: 'page-authentication',
  templateUrl: 'authentication.page.html',
  styleUrls: ['./authentication.page.scss']
})
export class AuthenticationPage {

  loginForm: FormGroup;
  errorMsg: string;
  hideSpinner = true;

  constructor(
    public translateService: TranslateService,
    private authenticationService: AuthenticationService,
    public config: Config
  ) { }
  /**
     * Lance l'ouverture de l'application 
     * secMobil SUA pour l'authentification
     */
  openSUA(): void {
    this.authenticationService.openSUA();
  }

}
