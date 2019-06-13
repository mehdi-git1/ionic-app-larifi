import { UpcomingFlightListPage } from './../../../modules/flight-activity/pages/upcoming-flight-list/upcoming-flight-list.page';
import { PncSearchPage } from './../../../modules/pnc-team/pages/pnc-search/pnc-search.page';
import { PncModel } from './../../models/pnc.model';
import { SessionService } from '../session/session.service';
import { AuthorizationService } from '../authorization/authorization.service';
import { LogbookPage } from '../../../modules/logbook/pages/logbook/logbook.page';
import { TabHeaderModeEnum } from '../../enums/tab-header-mode.enum';
import { UserMessageManagementPage } from '../../../modules/admin/pages/user-message-management/user-message-management.page';
import { AppVersionManagementPage } from '../../../modules/admin/pages/app-version-management/app-version-management.page';
import { ProfileManagementPage } from '../../../modules/admin/pages/profile-management/profile-management.page';
import { HelpAssetListPage } from '../../../modules/help-asset/pages/help-asset-list/help-asset-list.page';
import { CongratulationLettersPage } from '../../../modules/congratulation-letter/pages/congratulation-letters/congratulation-letters.page';
import { StatutoryCertificatePage } from '../../../modules/statutory-certificate/pages/statutory-certificate/statutory-certificate.page';
import { ProfessionalLevelPage } from '../../../modules/professional-level/pages/professional-level/professional-level.page';
import { CareerObjectiveListPage } from '../../../modules/development-program/pages/career-objective-list/career-objective-list.page';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TabHeaderService {

    activeTab: any;

    pnc: PncModel;

    constructor(
        private translateService: TranslateService,
        private authorizationService: AuthorizationService,
        private sessionService: SessionService
    ) {
    }

    /**
     * Initialise la navigation par onglet
     */
    initTabHeader() {
        const currentPnc = this.sessionService.visitedPnc == undefined ? this.sessionService.getActiveUser().authenticatedPnc : this.sessionService.visitedPnc;
        if (currentPnc != this.pnc) {
            this.pnc = currentPnc;
            this.activeTab = {
                EDOSSIER: this.pnc && this.pnc.manager ? ProfessionalLevelPage : CareerObjectiveListPage,
                ADMIN: ProfileManagementPage
            };
        }
    }

    /**
    * Retourne la liste des entrées à afficher dans les onglets en fonction du mode donné
    * @param mode le mode d'affichage demandé
    * @return une liste contenant les entrées à afficher dans les onglets
    */
    getTabList(mode: TabHeaderModeEnum) {
        this.initTabHeader();

        if (mode === TabHeaderModeEnum.EDOSSIER) {
            return [
                {
                    label: this.translateService.instant('GLOBAL.DEVELOPMENT_PROGRAM'),
                    component: CareerObjectiveListPage,
                    available: this.pnc && !this.pnc.manager
                },
                {
                    label: this.translateService.instant('GLOBAL.PROFESSIONAL_LEVEL'),
                    component: ProfessionalLevelPage,
                    available: this.authorizationService.hasPermission('VIEW_PROFESSIONAL_LEVEL')
                },
                {
                    label: this.translateService.instant('GLOBAL.STATUTORY_CERTIFICATE'),
                    component: StatutoryCertificatePage,
                    available: this.authorizationService.hasPermission('VIEW_STATUTORY_CERTIFICATE')
                },
                {
                    label: this.translateService.instant('GLOBAL.CONGRATULATION_LETTERS'),
                    component: CongratulationLettersPage,
                    available: true
                },
                {
                    label: this.translateService.instant('GLOBAL.LOGBOOK'),
                    component: LogbookPage,
                    available: this.authorizationService.hasPermission('VIEW_LOGBOOK')
                },
                {
                    label: this.translateService.instant('GLOBAL.UPCOMING_FLIGHT'),
                    component: UpcomingFlightListPage,
                    available: this.pnc && this.pnc.manager
                },
                {
                    label: this.translateService.instant('GLOBAL.HELP_CENTER'),
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
    isActiveTab(mode: TabHeaderModeEnum, tab: any): boolean {
        return this.activeTab && this.activeTab[mode] == tab.component;
    }

    /**
     * Définit un onglet comme actif, dans un mode donné
     * @param mode le mode concerné
     * @param tab l'onglet à définir comme actif
     */
    setActiveTab(mode: TabHeaderModeEnum, tab: any) {
        this.activeTab[mode] = tab.component;
    }

}
