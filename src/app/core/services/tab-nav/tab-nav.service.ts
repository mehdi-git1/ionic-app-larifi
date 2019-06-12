import { ProfessionalLevelPage } from './../../../modules/professional-level/pages/professional-level/professional-level.page';
import { CareerObjectiveListPage } from './../../../modules/development-program/pages/career-objective-list/career-objective-list.page';
import { HelpAssetListPage } from './../../../modules/help-asset/pages/help-asset-list/help-asset-list.page';
import { UpcomingFlightListPage } from './../../../modules/flight-activity/pages/upcoming-flight-list/upcoming-flight-list.page';
import { PncSearchPage } from './../../../modules/pnc-team/pages/pnc-search/pnc-search.page';
import { PncHomePage } from './../../../modules/home/pages/pnc-home/pnc-home.page';
import { TabNavEnum } from './../../enums/tab-nav.enum';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SecurityService } from '../security/security.service';
import { PncModel } from '../../models/pnc.model';
import { SessionService } from '../session/session.service';
import { Events } from 'ionic-angular';

@Injectable()
export class TabNavService {

    tabList: Array<Object>;

    constructor(private translateService: TranslateService,
        private securityService: SecurityService,
        private sessionService: SessionService,
        private events: Events) {
        this.initTabList();

        this.events.subscribe('user:authenticationDone', () => {
            this.initTabList();
        });
    }

    /**
     * Retourne l'index du tab demandé
     * @param tabNav Id du tab voulu
     * @return index du tab demandé
     */
    getTabIndex(tabNav: TabNavEnum): number {
        return this.tabList.findIndex((element) => element['id'] === tabNav);
    }

    /**
     * Retourne l'onglet demandé
     * @param tabNav Id du tab voulu
     * @return l'onglet demandé
     */
    getTab(tabNav: TabNavEnum): any {
        return this.tabList[this.getTabIndex(tabNav)];
    }

    /**
     * Initialise la liste des onglets
     */
    initTabList() {
        this.tabList = [
            {
                id: TabNavEnum.PNC_HOME_PAGE,
                title: this.translateService.instant('PNC_HOME.TITLE'),
                page: PncHomePage,
                icon: 'edospnc-home',
                available: true
            },
            {
                id: TabNavEnum.PNC_SEARCH_PAGE,
                title: this.translateService.instant('GLOBAL.MY_PNC_TEAM'),
                page: PncSearchPage,
                icon: 'edospnc-pncTeam',
                available: this.securityService.isManager()
            },
            {
                id: TabNavEnum.UPCOMING_FLIGHT_LIST_PAGE,
                title: this.translateService.instant('GLOBAL.MY_UPCOMING_FLIGHT'),
                page: UpcomingFlightListPage,
                icon: 'edospnc-upcomingFlight',
                available: this.securityService.isManager()
            },
            {
                id: TabNavEnum.HELP_ASSET_LIST_PAGE,
                title: this.translateService.instant('GLOBAL.MY_HELP_CENTER'),
                page: HelpAssetListPage,
                icon: 'edospnc-helpCenter',
                available: true
            },
            {
                id: TabNavEnum.VISITED_PNC,
                title: ' ',
                page: CareerObjectiveListPage,
                icon: 'md-person',
                available: false
            },
            {
                id: TabNavEnum.VISITED_MANAGER,
                title: ' ',
                page: ProfessionalLevelPage,
                icon: 'md-person',
                available: false
            }
        ];
    }

    /**
     * Récupère la liste des onglets à afficher dans le menu de navigation
     * @return la liste des onglets du menu de navigation
     */
    getTabList(): Array<any> {
        return this.tabList;
    }

    /**
     * Ajoute à la tabNav une entrée vers le dossier d'un PNC et redirige vers cette entrée
     * @param pnc le pnc à ajouter à la tabNav
     */
    addEDossierTab(pnc: PncModel) {
        this.getTab(TabNavEnum.VISITED_MANAGER).available = false;
        this.getTab(TabNavEnum.VISITED_PNC).available = false;

        if (pnc.manager) {
            this.getTab(TabNavEnum.VISITED_MANAGER).title = `${pnc.firstName} ${pnc.lastName}`;
            this.getTab(TabNavEnum.VISITED_MANAGER).available = true;
        } else {
            this.getTab(TabNavEnum.VISITED_PNC).title = `${pnc.firstName} ${pnc.lastName}`;
            this.getTab(TabNavEnum.VISITED_PNC).available = true;
        }
    }

}
