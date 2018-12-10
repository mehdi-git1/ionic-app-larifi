import { Component, Input, ViewChild } from '@angular/core';
import { Nav, Events, Tabs } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

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
import { SpecialityEnum } from '../../../core/enums/speciality.enum';
import { AuthenticationPage } from '../../../modules/home/pages/authentication/authentication.page';
import { FileTypeEnum } from '../../../core/enums/file-type.enum';
import { SummarySheetService } from '../../../core/services/summary-sheet/summary-sheet.service';
import { FileService } from '../../../core/file/file.service';
import { SummarySheetTransformerService } from '../../../core/services/summary-sheet/summary-sheet-transformer.service';

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
    private summarySheetTransformerService: SummarySheetTransformerService,
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
          this.updatePermissions();

          this.loading = false;
          this.navCtrl.popToRoot();
        }, error => {
        });
      }
    });

    this.events.subscribe('user:authenticationLogout', () => {
      this.navCtrl.setRoot(AuthenticationPage);
      this.loading = true;
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
      },
      {
        id: tabNavEnum.CAREER_OBJECTIVE_LIST_PAGE,
        title: this.translate.instant('GLOBAL.DEVELOPMENT_PROGRAM'),
        page: CareerObjectiveListPage,
        icon: 'edospnc-developmentProgram',
      },
      {
        id: tabNavEnum.SUMMARY_SHEET_PAGE,
        title: this.translate.instant('GLOBAL.PNC_SUMMARY_SHEET'),
        page: '',
        icon: 'edospnc-summarySheet',
      },
      {
        id: tabNavEnum.PNC_SEARCH_PAGE,
        title: this.translate.instant('GLOBAL.PNC_TEAM'),
        page: PncSearchPage,
        icon: 'edospnc-pncTeam',
      },
      {
        id: tabNavEnum.UPCOMING_FLIGHT_LIST_PAGE,
        title: this.translate.instant('GLOBAL.UPCOMING_FLIGHT'),
        page: UpcomingFlightListPage,
        icon: 'edospnc-upcomingFlight',
      },
      {
        id: tabNavEnum.HELP_ASSET_LIST_PAGE,
        title: this.translate.instant('GLOBAL.HELP_CENTER'),
        page: HelpAssetListPage,
        icon: 'edospnc-helpCenter'
      },
      {
        id: tabNavEnum.STATUTORY_CERTIFICATE_PAGE,
        title: this.translate.instant('GLOBAL.STATUTORY_CERTIFICATE'),
        page: StatutoryCertificatePage,
        icon: 'edospnc-statutoryCertificate',
      },
      {
        id: tabNavEnum.PROFESSIONAL_LEVEL_PAGE,
        title: this.translate.instant('GLOBAL.PROFESSIONAL_LEVEL'),
        page: ProfessionalLevelPage,
        icon: 'edospnc-professionalLevelWhite',
      }
    ];
  }

  /**
   * Met à jour les permissions de façon dynamique
   */
  updatePermissions() {
    this.tabsNav[this.tabNavService.findTabIndex(tabNavEnum.PNC_HOME_PAGE)].display = true;
    this.tabsNav[this.tabNavService.findTabIndex(tabNavEnum.CAREER_OBJECTIVE_LIST_PAGE)].display = !this.securityProvider.isManager();
    this.tabsNav[this.tabNavService.findTabIndex(tabNavEnum.SUMMARY_SHEET_PAGE)].display = !this.securityProvider.isManager();
    this.tabsNav[this.tabNavService.findTabIndex(tabNavEnum.PNC_SEARCH_PAGE)].display = this.securityProvider.isManager();
    this.tabsNav[this.tabNavService.findTabIndex(tabNavEnum.UPCOMING_FLIGHT_LIST_PAGE)].display = this.securityProvider.isManager();
    this.tabsNav[this.tabNavService.findTabIndex(tabNavEnum.HELP_ASSET_LIST_PAGE)].display = true;
    this.tabsNav[this.tabNavService.findTabIndex(tabNavEnum.STATUTORY_CERTIFICATE_PAGE)].display = !this.securityProvider.isManager() && this.securityProvider.hasPermissionToViewTab('VIEW_STATUTORY_CERTIFICATE');
    this.tabsNav[this.tabNavService.findTabIndex(tabNavEnum.PROFESSIONAL_LEVEL_PAGE)].display = !this.securityProvider.isManager() && this.securityProvider.hasPermissionToViewTab('VIEW_PROFESSIONAL_LEVEL');
  }

  /**
   * Permet la gestion du changement d'onglet
   * @param event evenement déclencheur de la fonction
   */
  tabChange(event) {
    if (event.tabTitle === this.translate.instant('GLOBAL.PNC_SUMMARY_SHEET')) {
      this.summarySheetDisplay();
    }
    this.events.publish('changeTab', { pageName: event.root.name, pageParams: event.rootParams });
  }

  /**
   * Affiche de la fiche synthèse
   */
  summarySheetDisplay() {
    this.summarySheetService.getSummarySheet(this.pnc.matricule).then(summarySheet => {
      this.fileService.displayFile(FileTypeEnum.PDF, this.summarySheetTransformerService.toSummarySheetFile(summarySheet));
    }, error => {
    });
  }
}
