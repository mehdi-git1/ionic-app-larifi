import { DeviceService } from 'src/app/core/services/device/device.service';

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { PermissionConstant } from '../../constants/permission.constant';
import { TabHeaderEnum } from '../../enums/tab-header.enum';
import { PncModel } from '../../models/pnc.model';
import { AuthorizationService } from '../authorization/authorization.service';
import { SessionService } from '../session/session.service';

@Injectable({ providedIn: 'root' })
export class TabHeaderService {

    pnc: PncModel;

    constructor(
        private translateService: TranslateService,
        private authorizationService: AuthorizationService,
        private sessionService: SessionService,
        private deviceService: DeviceService
    ) {
    }

    /**
     * Retourne la liste des entrées à afficher dans les onglets en fonction du mode donné
     * @return une liste contenant les entrées à afficher dans les onglets
     */
    getTabList() {
        this.pnc = this.sessionService.visitedPnc === undefined ?
            this.sessionService.getActiveUser().authenticatedPnc : this.sessionService.visitedPnc;
        return [
            {
                id: TabHeaderEnum.DEVELOPMENT_PROGRAM_PAGE,
                label: this.translateService.instant('GLOBAL.DEVELOPMENT_PROGRAM_SHORT'),
                route: 'development-program',
                available: this.pnc && !this.pnc.manager
            },
            {
                id: TabHeaderEnum.STATUTORY_CERTIFICATE_PAGE,
                label: this.translateService.instant('GLOBAL.STATUTORY_CERTIFICATE_SHORT'),
                route: 'statutory-certificate',
                available: this.authorizationService.hasPermission(PermissionConstant.VIEW_STATUTORY_CERTIFICATE)
            },
            {
                id: TabHeaderEnum.HR_DOCUMENT_PAGE,
                label: this.translateService.instant('GLOBAL.HR_DOCUMENT'),
                route: 'hr-document',
                available: true
            },
            {
                id: TabHeaderEnum.PROFESSIONAL_LEVEL_PAGE,
                label: this.translateService.instant('GLOBAL.PROFESSIONAL_LEVEL_SHORT'),
                route: 'professional-level',
                available: this.authorizationService.hasPermission(PermissionConstant.VIEW_PROFESSIONAL_LEVEL)
            },
            {
                id: TabHeaderEnum.LOGBOOK_PAGE,
                label: this.translateService.instant('GLOBAL.LOGBOOK'),
                route: 'logbook',
                available: this.pnc && !this.pnc.manager && this.authorizationService.hasPermission(PermissionConstant.VIEW_LOGBOOK)
            },
            {
                id: TabHeaderEnum.BUSINESS_INDICATORS_PAGE,
                label: this.translateService.instant('GLOBAL.BUSINESS_INDICATORS'),
                route: 'business-indicators',
                available: this.authorizationService.hasPermission(PermissionConstant.VIEW_BUSINESS_INDICATORS)
                    && this.pnc && (this.pnc.hasBeenCCIn12LastMonths
                        || this.pnc.manager)
            },
            {
                id: TabHeaderEnum.CONGRATULATION_LETTERS_PAGE,
                label: this.translateService.instant('GLOBAL.CONGRATULATION_LETTERS_SHORT'),
                route: 'congratulation-letter',
                available: true
            },
            {
                id: TabHeaderEnum.REDACTIONS_PAGE,
                label: this.translateService.instant('GLOBAL.REDACTIONS'),
                route: 'redactions',
                available: true
            },
            {
                id: TabHeaderEnum.UPCOMING_FLIGHT_LIST_PAGE,
                label: this.translateService.instant('GLOBAL.UPCOMING_FLIGHT'),
                route: 'flight',
                available: this.pnc && this.pnc.manager
            },
            {
                id: TabHeaderEnum.ACTIVITY_PAGE,
                label: this.translateService.instant('ACTIVITY.TITLE'),
                route: 'activity',
                available: true
            },
            {
                id: TabHeaderEnum.ALTERNANT_SEARCH,
                label: this.translateService.instant('GLOBAL.ALTERNANT_TEAM'),
                route: 'pnc-search/ALTERNANT',
                available: !this.sessionService.getActiveUser().isManager
                    && this.authorizationService.hasPermission(PermissionConstant.VIEW_ALTERNANT_SEARCH)
            },
            {
                id: TabHeaderEnum.HELP_ASSET_LIST_PAGE,
                label: this.translateService.instant('GLOBAL.HELP_CENTER'),
                route: 'help-asset',
                available: true
            }
        ];
    }
}
