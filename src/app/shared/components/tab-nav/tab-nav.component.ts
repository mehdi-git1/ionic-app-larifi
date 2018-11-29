import { Component, Input, ViewChild } from '@angular/core';
import { Nav, Events, Tabs } from 'ionic-angular';

import { PncModel } from '../../../core/models/pnc.model';
import { SpecialityService } from '../../../core/services/speciality/speciality.service';
import { StatutoryCertificatePage } from '../../../modules/statutory-certificate/pages/statutory-certificate/statutory-certificate.page';
import { ProfessionalLevelPage } from '../../../modules/professional-level/pages/professional-level/professional-level.page';
import { PncSearchPage } from '../../../modules/pnc-team/pages/pnc-search/pnc-search.page';
import { PncHomePage } from '../../../modules/home/pages/pnc-home/pnc-home.page';
import { UpcomingFlightListPage } from '../../../modules/flight-activity/pages/upcoming-flight-list/upcoming-flight-list.page';
import { HelpAssetListPage } from '../../../modules/help-asset/pages/help-asset-list/help-asset-list.page';
import { CareerObjectiveListPage } from '../../../modules/development-program/pages/career-objective-list/career-objective-list.page';
import { PncService } from '../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../core/services/session/session.service';
import { SecurityServer } from '../../../core/services/security/security.server';
import { TabNavService } from '../../../core/services/tab-nav/tab-nav.service';
import { tabNavEnum } from '../../../core/enums/tab-nav.enum';
import { TranslateService } from '@ngx-translate/core';
import { SpecialityEnum } from '../../../core/enums/speciality.enum';
import { Utils } from '../../utils/utils';
import { FileTypeEnum } from '../../../core/enums/file-type.enum';
import { SummarySheetService } from '../../../core/services/summary-sheet/summary-sheet.service';
import { FileService } from '../../../core/file/file.service';

@Component({
  selector: 'tab-nav',
  templateUrl: 'tab-nav.component.html'
})
export class TabNavComponent {

  @Input() navCtrl: Nav;

  _matricule: string;

  @ViewChild('tabs') tabs: Tabs;
  pnc: PncModel;

  // exporter la classe enum speciality dans la page html
  Speciality = SpecialityEnum;

  // Paramètres envoyés aux pages
  pncParams;
  matriculeParams;
  roleParams;
  tabsNav;

  loading = true;

  constructor(
    private events: Events,
    private pncProvider: PncService,
    private tabNavService: TabNavService,
    private translate: TranslateService,
    private sessionService: SessionService,
    public securityProvider: SecurityServer,
    private specialityService: SpecialityService,
    private summarySheetService: SummarySheetService,
    private fileService: FileService
  ) {
    this.events.subscribe('user:authenticationDone', () => {
      if (this.sessionService.getActiveUser()) {
        this.pncProvider.getPnc(this.sessionService.getActiveUser().matricule).then(pnc => {
          this.pnc = pnc;
          this.pncParams = this.pnc;
          this.matriculeParams = { matricule: this.pnc.matricule };
          this.roleParams = { pncRole: this.specialityService.getPncRole(this.pnc.speciality) };
          if (!this.tabsNav) {
            this.tabsNav = this.createListOfTab();
          }
          this.tabNavService.setListOfTabs(this.tabsNav);
          this.changePermissions();
          this.loading = false;
          this.navCtrl.popToRoot();
        }, error => {
        });
      }
    });

    this.events.subscribe('changeTab', (data) => {
      // Pour l'instant, rien n'est fait dans ce subscribe car cela est juste une analyse
    });
  }

  /**
   * initialisation des navTab
   */
  createListOfTab() {
    return [
      {
        id: tabNavEnum.PNC_HOME_PAGE,
        title: this.translate.instant('PNC_HOME.TITLE'),
        page: PncHomePage,
        icon: 'edospnc-home',
        params: this.matriculeParams
      },
      {
        id: tabNavEnum.CAREER_OBJECTIVE_LIST_PAGE,
        title: this.translate.instant('GLOBAL.DEVELOPMENT_PROGRAM'),
        page: CareerObjectiveListPage,
        icon: 'edospnc-developmentProgram',
        params: this.matriculeParams
      },
      {
        id: tabNavEnum.SUMMARY_SHEET_PAGE,
        title: this.translate.instant('GLOBAL.PNC_SUMMARY_SHEET'),
        page: '',
        icon: 'edospnc-summarySheet',
        params: this.matriculeParams
      },
      {
        id: tabNavEnum.PNC_SEARCH_PAGE,
        title: this.translate.instant('GLOBAL.PNC_TEAM'),
        page: PncSearchPage,
        icon: 'edospnc-pncTeam',
        params: ''
      },
      {
        id: tabNavEnum.UPCOMING_FLIGHT_LIST_PAGE,
        title: this.translate.instant('GLOBAL.UPCOMING_FLIGHT'),
        page: UpcomingFlightListPage,
        icon: 'edospnc-upcomingFlight',
        params: ''
      },
      {
        id: tabNavEnum.HELP_ASSET_LIST_PAGE,
        title: this.translate.instant('GLOBAL.HELP_CENTER'),
        page: HelpAssetListPage,
        icon: 'edospnc-helpCenter',
        params: this.roleParams
      },
      {
        id: tabNavEnum.STATUTORY_CERTIFICATE_PAGE,
        title: this.translate.instant('GLOBAL.STATUTORY_CERTIFICATE'),
        page: StatutoryCertificatePage,
        icon: 'edospnc-statutoryCertificate',
        params: this.matriculeParams
      },
      {
        id: tabNavEnum.PROFESSIONAL_LEVEL_PAGE,
        title: this.translate.instant('GLOBAL.PROFESSIONAL_LEVEL'),
        page: ProfessionalLevelPage,
        icon: 'md-briefcase',
        params: ''
      }
    ];
  }

  /**
   * Permet de mettre à jour les permissions de façon dynamique
   */
  changePermissions() {
    this.tabsNav[this.tabNavService.findTabIndex(tabNavEnum.PNC_HOME_PAGE)].display = true;
    this.tabsNav[this.tabNavService.findTabIndex(tabNavEnum.CAREER_OBJECTIVE_LIST_PAGE)].display = !this.securityProvider.isManager();
    this.tabsNav[this.tabNavService.findTabIndex(tabNavEnum.SUMMARY_SHEET_PAGE)].display = !this.securityProvider.isManager();
    this.tabsNav[this.tabNavService.findTabIndex(tabNavEnum.PNC_SEARCH_PAGE)].display = this.securityProvider.isManager();
    this.tabsNav[this.tabNavService.findTabIndex(tabNavEnum.UPCOMING_FLIGHT_LIST_PAGE)].display = this.securityProvider.isManager();
    this.tabsNav[this.tabNavService.findTabIndex(tabNavEnum.HELP_ASSET_LIST_PAGE)].display = true;
    this.tabsNav[this.tabNavService.findTabIndex(tabNavEnum.STATUTORY_CERTIFICATE_PAGE)].display = !this.securityProvider.isManager() && this.securityProvider.hasPermissionToViewTab('VIEW_STATUTORY_CERTIFICATE');
    this.tabsNav[this.tabNavService.findTabIndex(tabNavEnum.PROFESSIONAL_LEVEL_PAGE)].display = this.securityProvider.hasPermissionToViewTab('VIEW_PROFESSIONAL_LEVEL');
  }

  /**
   * Permet la gestion du changement d'onglet
   * @param event evenement déclencheur de la fonction
   */
  tabChange(event) {
    this.clickChange();
    this.events.publish('changeTab', { pageName: event.root.name, pageParams: event.rootParams });
  }

  clickChange() {
    let previewSrc = '';
    this.summarySheetService.getSummarySheet(this.pnc.matricule).then(summarySheet => {
      try {
        if (summarySheet && summarySheet.summarySheet) {
          const file = new Blob([Utils.base64ToArrayBuffer(summarySheet.summarySheet)], { type: 'application/pdf' });
          previewSrc = URL.createObjectURL(file);
          this.fileService.displayFile(FileTypeEnum.PDF, previewSrc);
        } else {
          previewSrc = null;
        }
      } catch (error) {
        console.error('createObjectURL error:' + error);
      }
    }, error => {
    });
  }
}
