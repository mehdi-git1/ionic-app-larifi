import { HrReportPage } from './../../../modules/hr-report/pages/hr-report/hr-report.page';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {
    AppVersionListPage
} from '../../../modules/admin/pages/app-version/page/app-version-list/app-version-list.page';
import {
    ProfileManagementPage
} from '../../../modules/admin/pages/profile-management/profile-management.page';
import {
    UserMessageManagementPage
} from '../../../modules/admin/pages/user-message-management/user-message-management.page';
import {
    CongratulationLettersPage
} from '../../../modules/congratulation-letter/pages/congratulation-letters/congratulation-letters.page';
import {
    CareerObjectiveListPage
} from '../../../modules/development-program/pages/career-objective-list/career-objective-list.page';
import {
    UpcomingFlightListPage
} from '../../../modules/flight-activity/pages/upcoming-flight-list/upcoming-flight-list.page';
import {
    HelpAssetListPage
} from '../../../modules/help-asset/pages/help-asset-list/help-asset-list.page';
import { LogbookPage } from '../../../modules/logbook/pages/logbook/logbook.page';
import {
    ProfessionalLevelPage
} from '../../../modules/professional-level/pages/professional-level/professional-level.page';
import {
    StatutoryCertificatePage
} from '../../../modules/statutory-certificate/pages/statutory-certificate/statutory-certificate.page';
import { PermissionConstant } from '../../constants/permission.constant';
import { TabHeaderModeEnum } from '../../enums/tab-header-mode.enum';
import { TabHeaderEnum } from '../../enums/tab-header.enum';
import { PncModel } from '../../models/pnc.model';
import { AuthorizationService } from '../authorization/authorization.service';
import { SessionService } from '../session/session.service';

@Injectable()
export class TabHeaderService {

    pnc: PncModel;

    constructor(
        private translateService: TranslateService,
        private authorizationService: AuthorizationService,
        private sessionService: SessionService
    ) {
    }

    /**
    * Retourne la liste des entrées à afficher dans les onglets en fonction du mode donné
    * @param mode le mode d'affichage demandé
    * @return une liste contenant les entrées à afficher dans les onglets
    */
    getTabList(mode: TabHeaderModeEnum) {
        this.pnc = this.sessionService.visitedPnc == undefined ? this.sessionService.getActiveUser().authenticatedPnc : this.sessionService.visitedPnc;

        if (mode === TabHeaderModeEnum.EDOSSIER) {
            return [
                {
                    id: TabHeaderEnum.CAREER_OBJECTIVE_LIST_PAGE,
                    label: this.translateService.instant('GLOBAL.DEVELOPMENT_PROGRAM'),
                    component: CareerObjectiveListPage,
                    available: this.pnc && !this.pnc.manager
                },
                {
                    id: TabHeaderEnum.PROFESSIONAL_LEVEL_PAGE,
                    label: this.translateService.instant('GLOBAL.PROFESSIONAL_LEVEL'),
                    component: ProfessionalLevelPage,
                    available: this.authorizationService.hasPermission(PermissionConstant.VIEW_PROFESSIONAL_LEVEL)
                },
                {
                    id: TabHeaderEnum.STATUTORY_CERTIFICATE_PAGE,
                    label: this.translateService.instant('GLOBAL.STATUTORY_CERTIFICATE'),
                    component: StatutoryCertificatePage,
                    available: this.authorizationService.hasPermission(PermissionConstant.VIEW_STATUTORY_CERTIFICATE)
                },
                {
                    id: TabHeaderEnum.HR_REPORT_PAGE,
                    label: this.translateService.instant('GLOBAL.HR_REPORT'),
                    component: HrReportPage,
                    available: true
                },
                {
                    id: TabHeaderEnum.CONGRATULATION_LETTERS_PAGE,
                    label: this.translateService.instant('GLOBAL.CONGRATULATION_LETTERS'),
                    component: CongratulationLettersPage,
                    available: true
                },
                {
                    id: TabHeaderEnum.LOGBOOK_PAGE,
                    label: this.translateService.instant('GLOBAL.LOGBOOK'),
                    component: LogbookPage,
                    available: this.pnc && !this.pnc.manager && this.authorizationService.hasPermission(PermissionConstant.VIEW_LOGBOOK)
                },
                {
                    id: TabHeaderEnum.UPCOMING_FLIGHT_LIST_PAGE,
                    label: this.translateService.instant('GLOBAL.UPCOMING_FLIGHT'),
                    component: UpcomingFlightListPage,
                    available: this.pnc && this.pnc.manager
                },
                {
                    id: TabHeaderEnum.HELP_ASSET_LIST_PAGE,
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
                    id: TabHeaderEnum.PROFILE_MANAGEMENT_PAGE,
                    label: this.translateService.instant('ADMIN.ADMIN_NAV_TABS.PROFILE_MANAGEMENT'),
                    component: ProfileManagementPage,
                    available: true
                },
                {
                    id: TabHeaderEnum.APP_VERSION_MANAGEMENT_PAGE,
                    label: this.translateService.instant('ADMIN.ADMIN_NAV_TABS.APP_VERSION_MANAGEMENT'),
                    component: AppVersionListPage,
                    available: true
                },
                {
                    id: TabHeaderEnum.USER_MESSAGE_MANAGEMENT_PAGE,
                    label: this.translateService.instant('ADMIN.ADMIN_NAV_TABS.USER_MESSAGE_MANAGEMENT'),
                    component: UserMessageManagementPage,
                    available: true
                }
            ];
        }
    }

}
