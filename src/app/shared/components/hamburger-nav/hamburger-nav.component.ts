import { SecurityService } from './../../../core/services/security/security.service';
import { AuthenticationPage } from './../../../modules/home/pages/authentication/authentication.page';
import { AuthenticatedUserModel } from './../../../core/models/authenticated-user.model';
import { CongratulationLettersPage } from './../../../modules/congratulation-letter/pages/congratulation-letters/congratulation-letters.page';
import { ProfessionalLevelPage } from './../../../modules/professional-level/pages/professional-level/professional-level.page';
import { StatutoryCertificatePage } from './../../../modules/statutory-certificate/pages/statutory-certificate/statutory-certificate.page';
import { HelpAssetListPage } from './../../../modules/help-asset/pages/help-asset-list/help-asset-list.page';
import { UpcomingFlightListPage } from './../../../modules/flight-activity/pages/upcoming-flight-list/upcoming-flight-list.page';
import { PncSearchPage } from './../../../modules/pnc-team/pages/pnc-search/pnc-search.page';
import { CareerObjectiveListPage } from './../../../modules/development-program/pages/career-objective-list/career-objective-list.page';
import { PncHomePage } from './../../../modules/home/pages/pnc-home/pnc-home.page';
import { Component, Input } from '@angular/core';
import { Nav, MenuController, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Session } from 'selenium-webdriver';
import { SessionService } from '../../../core/services/session/session.service';
import { PncModel } from '../../../core/models/pnc.model';
import { SettingsPage } from '../../../modules/settings/pages/settings/settings.page';
import { SynchronizationManagementPage } from '../../../modules/synchronization/pages/synchronization-management/synchronization-management.page';

@Component({
    selector: 'hamburger-nav',
    templateUrl: 'hamburger-nav.component.html'
})
export class HamburgerNavComponent {

    @Input() navCtrl: Nav;

    pageList: Array<any>;
    activePage: any;
    currentUser: PncModel;

    constructor(
        private translateService: TranslateService,
        private menuCtrl: MenuController,
        private sessionService: SessionService,
        private securityService: SecurityService,
        private events: Events
    ) {
        this.initMenu();
        this.events.subscribe('user:authenticationDone', () => {
            this.initMenu();
        });

        this.events.subscribe('user:authenticationLogout', () => {
            this.navCtrl.setRoot(AuthenticationPage);
        });
    }

    /**
     * Initialise le menu
     */
    initMenu() {
        this.pageList = this.createPageList();
        this.activePage = this.pageList[0];
        this.currentUser = this.getCurrentUser();
    }

    /**
     * Récupère l'utilisateur connecté à l'application
     * @return l'utilisateur connecté à l'application
     */
    getCurrentUser(): PncModel {
        const currentUser = new PncModel();
        if (this.sessionService.getActiveUser()) {
            currentUser.matricule = this.sessionService.getActiveUser().matricule;
            currentUser.firstName = this.sessionService.getActiveUser().firstName;
            currentUser.lastName = this.sessionService.getActiveUser().lastName;
        }

        return currentUser;
    }

    /**
     * Retourne la liste des entrées à afficher dans le menu hamburger
     * @return une liste contenant les entrées du menu hamburger
     */
    createPageList() {
        return [
            [
                {
                    label: this.translateService.instant('PNC_HOME.TITLE'),
                    component: PncHomePage,
                    icon: 'edospnc-home',
                    available: true
                },
                {
                    label: this.translateService.instant('GLOBAL.MY_DEVELOPMENT_PROGRAM'),
                    component: CareerObjectiveListPage,
                    icon: 'edospnc-developmentProgram',
                    available: !this.securityService.isManager()
                },
                {
                    label: this.translateService.instant('GLOBAL.MY_PNC_TEAM'),
                    component: PncSearchPage,
                    icon: 'edospnc-pncTeam',
                    available: this.securityService.isManager()
                },
                {
                    label: this.translateService.instant('GLOBAL.MY_UPCOMING_FLIGHT'),
                    component: UpcomingFlightListPage,
                    icon: 'edospnc-upcomingFlight',
                    available: this.securityService.isManager()
                },
                {
                    label: this.translateService.instant('GLOBAL.MY_STATUTORY_CERTIFICATE'),
                    component: StatutoryCertificatePage,
                    icon: 'edospnc-statutoryCertificate',
                    available: !this.securityService.isManager() && this.securityService.hasPermissionToViewTab('VIEW_STATUTORY_CERTIFICATE')
                },
                {
                    label: this.translateService.instant('GLOBAL.MY_PROFESSIONAL_LEVEL'),
                    component: ProfessionalLevelPage,
                    icon: 'edospnc-professionalLevel',
                    available: !this.securityService.isManager() && this.securityService.hasPermissionToViewTab('VIEW_PROFESSIONAL_LEVEL')
                },
                {
                    label: this.translateService.instant('GLOBAL.MY_CONGRATULATION_LETTERS'),
                    component: CongratulationLettersPage,
                    icon: 'ios-mail-outline',
                    available: true
                },
                {
                    label: this.translateService.instant('GLOBAL.MY_HELP_CENTER'),
                    component: HelpAssetListPage,
                    icon: 'edospnc-helpCenter',
                    available: true
                }],
            [
                {
                    label: this.translateService.instant('SETTINGS.TITLE'),
                    component: SettingsPage,
                    icon: 'settings',
                    available: true
                },
                {
                    label: this.translateService.instant('SYNCHRONIZATION_MANAGEMENT.TITLE'),
                    component: SynchronizationManagementPage,
                    icon: 'md-download',
                    available: true
                }
            ]
        ];
    }

    /**
     * Ouvre la page indiquée en paramètre
     * @param page la page vers laquelle naviguer
     */
    openPage(page: any) {
        this.activePage = page;
        this.navCtrl.setRoot(page.component);
        this.menuCtrl.close();
    }

    /**
     * Teste si une entrée de menu est active (si on est sur la page correspondante)
     * @param page l'entrée à tester
     * @return vrai s'il s'agit de l'entrée active, faux sinon
     */
    isActive(page: any): boolean {
        return page === this.activePage;
    }
}
