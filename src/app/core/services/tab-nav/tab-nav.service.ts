import { TabNavModeEnum } from './../../enums/tab-nav-mode.enum';
import { UserMessageManagementPage } from './../../../modules/admin/pages/user-message-management/user-message-management.page';
import { AppVersionManagementPage } from './../../../modules/admin/pages/app-version-management/app-version-management.page';
import { ProfileManagementPage } from './../../../modules/admin/pages/profile-management/profile-management.page';
import { HelpAssetListPage } from './../../../modules/help-asset/pages/help-asset-list/help-asset-list.page';
import { CongratulationLettersPage } from './../../../modules/congratulation-letter/pages/congratulation-letters/congratulation-letters.page';
import { StatutoryCertificatePage } from './../../../modules/statutory-certificate/pages/statutory-certificate/statutory-certificate.page';
import { ProfessionalLevelPage } from './../../../modules/professional-level/pages/professional-level/professional-level.page';
import { UpcomingFlightListPage } from './../../../modules/flight-activity/pages/upcoming-flight-list/upcoming-flight-list.page';
import { PncSearchPage } from './../../../modules/pnc-team/pages/pnc-search/pnc-search.page';
import { CareerObjectiveListPage } from './../../../modules/development-program/pages/career-objective-list/career-objective-list.page';
import { PncHomePage } from './../../../modules/home/pages/pnc-home/pnc-home.page';
import { SecurityService } from './../security/security.service';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TabNavService {

    activeTab: any;

    constructor(
        private translateService: TranslateService,
        private securityService: SecurityService
    ) {
        this.activeTab = {
            EDOSSIER: CareerObjectiveListPage,
            ADMIN: ProfileManagementPage
        };
    }

    /**
    * Retourne la liste des entrées à afficher dans les onglets en fonction du mode donné
    * @param mode le mode d'affichage demandé
    * @return une liste contenant les entrées à afficher dans les onglets
    */
    getTabList(mode: TabNavModeEnum) {
        if (mode === TabNavModeEnum.EDOSSIER) {
            return [
                {
                    label: this.translateService.instant('PNC_HOME.TITLE'),
                    component: PncHomePage,
                    available: true
                },
                {
                    label: this.translateService.instant('GLOBAL.MY_DEVELOPMENT_PROGRAM'),
                    component: CareerObjectiveListPage,
                    available: !this.securityService.isManager()
                },
                {
                    label: this.translateService.instant('GLOBAL.MY_PNC_TEAM'),
                    component: PncSearchPage,
                    available: this.securityService.isManager()
                },
                {
                    label: this.translateService.instant('GLOBAL.MY_UPCOMING_FLIGHT'),
                    component: UpcomingFlightListPage,
                    available: this.securityService.isManager()
                },
                {
                    label: this.translateService.instant('GLOBAL.MY_PROFESSIONAL_LEVEL'),
                    component: ProfessionalLevelPage,
                    available: this.securityService.hasPermissionToViewTab('VIEW_PROFESSIONAL_LEVEL')
                },
                {
                    label: this.translateService.instant('GLOBAL.MY_STATUTORY_CERTIFICATE'),
                    component: StatutoryCertificatePage,
                    available: this.securityService.hasPermissionToViewTab('VIEW_STATUTORY_CERTIFICATE')
                },
                {
                    label: this.translateService.instant('GLOBAL.MY_CONGRATULATION_LETTERS'),
                    component: CongratulationLettersPage,
                    available: true
                },
                {
                    label: this.translateService.instant('GLOBAL.MY_HELP_CENTER'),
                    component: HelpAssetListPage,
                    available: true
                }
            ];
        }
        else {
            // Entrées du mode admin
            return [
                {
                    label: this.translateService.instant('ADMIN.ADMIN_NAV_TABS.PROFILE_MANAGEMENT'),
                    component: ProfileManagementPage,
                    available: true
                },
                {
                    label: this.translateService.instant('ADMIN.ADMIN_NAV_TABS.APP_VERSION_MANAGEMENT'),
                    component: AppVersionManagementPage,
                    available: true
                },
                {
                    label: this.translateService.instant('ADMIN.ADMIN_NAV_TABS.USER_MESSAGE_MANAGEMENT'),
                    component: UserMessageManagementPage,
                    available: true
                }
            ];
        }
    }

    /**
     * Teste si un onglet est actif, pour un mode donné
     * @param mode le mode concerné
     * @param tab l'onglet à tester
     * @return vrai si l'onglet donné est actif, faux sinon
     */
    isActiveTab(mode: TabNavModeEnum, tab: any): boolean {
        return this.activeTab[mode] == tab.component;
    }

    /**
     * Définit un onglet comme actif, dans un mode donné
     * @param mode le mode concerné
     * @param tab l'onglet à définir comme actif
     */
    setActiveTab(mode: TabNavModeEnum, tab: any) {
        this.activeTab[mode] = tab.component;
    }

}
