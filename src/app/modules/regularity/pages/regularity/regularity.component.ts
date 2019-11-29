import { AuthorizationService } from './../../../../core/services/authorization/authorization.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { ConnectivityService } from './../../../../core/services/connectivity/connectivity.service';
import { DeviceService } from './../../../../core/services/device/device.service';
import { SecurityService } from './../../../../core/services/security/security.service';
import { TranslateService } from '@ngx-translate/core';
import { PncRoleEnum } from './../../../../core/enums/pnc-role.enum';
import { PncModel } from './../../../../core/models/pnc.model';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { Component, OnInit, isDevMode } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabHeaderEnum } from 'src/app/core/enums/tab-header.enum';
import { AppParameterModel } from 'src/app/core/models/app-parameter.model';


@Component({
  selector: 'app-regularity',
  templateUrl: './regularity.component.html',
  styleUrls: ['./regularity.component.scss'],
})
export class RegularityComponent implements OnInit {
  matricule: string;
  pnc: PncModel;
  pncRole: PncRoleEnum;
  tabHeaderEnum: TabHeaderEnum = TabHeaderEnum.REGULARITY_PAGE;
  links = [];
  isCad = false;
  isweb = true;
  isConnected = false;
  regularityLinks: Array<AppParameterModel>;

  constructor(
    private pncService: PncService,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private securityService: SecurityService,
    private deviceService: DeviceService,
    private connectivityService: ConnectivityService,
    private sessionService: SessionService,
  ) { }

  ngOnInit() {
    this.matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
    this.pncService.getPnc(this.matricule).then(
      pnc => {
        this.pnc = pnc;
        this.pncRole = pnc.manager ? PncRoleEnum.MANAGER : PncRoleEnum.PNC;
      }
    );
    this.isCad = this.securityService.isManager();
    this.isweb = this.deviceService.isBrowser();
    this.isConnected = this.connectivityService.isConnected();

    this.securityService.getAuthenticatedUser().then(u => {
      this.regularityLinks = u.appInitData.regularityLinks;
    });
  }

  getTranslation(key: string): string {
    return this.translateService.instant('REGULARITY_LABEL_LIST.' + key);
  }
  /**
   * redirige vers un lien
   * extere à l'appli
   *
   * @param externalUrl url destination
   */
  gotoLink(externalUrl: string): void {
    const url = externalUrl.replace('%MATRICULE%', this.pnc.matricule);
    window.open(url, '_blank');
  }
}
