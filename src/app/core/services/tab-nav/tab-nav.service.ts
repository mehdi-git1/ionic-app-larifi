import { PncService } from 'src/app/core/services/pnc/pnc.service';
import {
    DevelopmentProgramPage
} from 'src/app/modules/development-program/pages/development-program/development-program.page';
import { MyBoardHomePage } from 'src/app/modules/my-board/pages/my-board-home/my-board-home.page';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import {
    UpcomingFlightListPage
} from '../../../modules/flight-activity/pages/upcoming-flight-list/upcoming-flight-list.page';
import {
    HelpAssetListPage
} from '../../../modules/help-asset/pages/help-asset-list/help-asset-list.page';
import { PncHomePage } from '../../../modules/home/pages/pnc-home/pnc-home.page';
import { PncSearchPage } from '../../../modules/pnc-team/pages/pnc-search/pnc-search.page';
import { Utils } from '../../../shared/utils/utils';
import { TabNavEnum } from '../../enums/tab-nav.enum';
import { PncModel } from '../../models/pnc.model';
import { Events } from '../events/events.service';
import { SecurityService } from '../security/security.service';
import { SessionService } from '../session/session.service';

@Injectable({ providedIn: 'root' })
export class TabNavService {

    tabList: Array<any>;

    constructor(
        private translateService: TranslateService,
        private sessionService: SessionService,
        private securityService: SecurityService,
        private pncService: PncService,
        private events: Events,
        private router: Router,
        private loadingCtrl: LoadingController
    ) {
        this.initTabList();

        this.handleEdossierVisit();

        this.events.subscribe('user:authenticationDone', () => {
            this.initTabList();
        });

        this.events.subscribe('myBoard:uncheckedNotificationCountUpdate', (data) => {
            this.getTab(TabNavEnum.MY_BOARD_PAGE).badgeValue = data.uncheckedNotificationCount;
        });
    }

    /**
     * Met à jour la liste des tab dans le service
     * Ce tableau ne peut pas être créé dans le service, dû au fait que l'on appelle des pages pour la création,
     * ce qui créé des redondances lors de l'appel de ce service par ces mêmes pages
     * @param tabList liste des tabs créés
     */
    setListOfTabs(tabList) {
        this.tabList = tabList;
    }

    /**
     * initialisation des navTab
     */
    initTabList() {
        this.tabList = [
            {
                id: TabNavEnum.PNC_HOME_PAGE,
                title: this.translateService.instant('PNC_HOME.MY_TITLE'),
                page: this.sessionService.getActiveUser().isManager ? PncHomePage : DevelopmentProgramPage,
                icon: 'home',
                route: 'home',
                display: true,
                badgeValue: 0
            },
            {
                id: TabNavEnum.MY_BOARD_PAGE,
                title: this.translateService.instant('GLOBAL.MY_BOARD'),
                page: MyBoardHomePage,
                icon: 'speedometer',
                route: 'myboard',
                display: this.securityService.isManager(),
                badgeValue: 0
            },
            {
                id: TabNavEnum.PNC_SEARCH_PAGE,
                title: this.translateService.instant('GLOBAL.MY_PNC_TEAM'),
                page: PncSearchPage,
                icon: 'people',
                route: 'search',
                display: this.securityService.isManager(),
                badgeValue: 0
            },
            {
                id: TabNavEnum.UPCOMING_FLIGHT_LIST_PAGE,
                title: this.translateService.instant('GLOBAL.MY_UPCOMING_FLIGHT'),
                page: UpcomingFlightListPage,
                icon: 'paper-plane',
                route: 'flight',
                display: this.securityService.isManager(),
                badgeValue: 0
            },
            {
                id: TabNavEnum.VISITED_PNC,
                title: ' ',
                page: DevelopmentProgramPage,
                icon: 'person',
                route: 'visit',
                display: false,
                badgeValue: 0
            },
            {
                id: TabNavEnum.HELP_ASSET_LIST_PAGE,
                title: this.translateService.instant('GLOBAL.MY_HELP_CENTER'),
                page: HelpAssetListPage,
                icon: 'help-circle',
                route: 'help',
                display: this.securityService.isManager(),
                badgeValue: 0
            }
        ];

    }

    /**
     * Il est impossible de gérer ce traitement dans un service (problème d'injection inconnu). On gère donc cela avec un système d'events..
     */
    handleEdossierVisit(): void {
        this.events.subscribe('EDossier:visited', (data) => {
            if (this.sessionService.isActiveUser(data.visitedPnc)) {
                this.sessionService.visitedPnc = undefined;
                this.router.navigate(['tabs', 'home']);
            } else {
                this.loadVisitedPnc(data.visitedPnc.matricule).then(() => {
                    if (data.visitedPnc.manager) {
                        this.router.navigate(['tabs', 'visit', this.sessionService.visitedPnc.matricule, 'statutory-certificate']);
                    } else {
                        this.router.navigate(['tabs', 'visit', this.sessionService.visitedPnc.matricule, 'development-program']);
                    }
                });
            }
        });
    }

    /**
     * Charge le PNC qu'on souhaite "visiter" et affiche l'entrée dans la TabNav
     * @param matricule le matricule du PNC dont on souhaite voir le dossier
     * @return une promesse, résolue quand le PNC est chargé en session
     */
    loadVisitedPnc(matricule: string): Promise<PncModel> {
        return this.loadingCtrl.create({
            message: this.translateService.instant('GLOBAL.LOADING_EDOSSIER_MESSAGE')
        }).then(loading => {
            loading.present();

            return this.pncService.getPnc(matricule).then(pncFound => {
                loading.dismiss();
                this.sessionService.visitedPnc = pncFound;

                this.addEDossierTab(pncFound);

                return pncFound;
            });
        });
    }

    /**
     * Ajoute à la tabNav une entrée vers le dossier d'un PNC
     * @param pnc le pnc à ajouter à la tabNav
     */
    addEDossierTab(pnc: PncModel) {
        this.getTab(TabNavEnum.VISITED_PNC).title = `${pnc.lastName} ${Utils.capitalize(pnc.firstName)}`;
        this.getTab(TabNavEnum.VISITED_PNC).display = true;
    }

    /**
     * Retourne l'onglet demandé
     * @param tabNav Id du tab voulu
     * @return l'onglet demandé
     */
    getTab(tabNav: TabNavEnum): any {
        return this.tabList.find(tab => {
            return tab.id === tabNav;
        });
    }

    /**
     * Sauvegarde l'onglet actif
     * @param activeRoute la route active
     */
    setActiveTab(activeRoute: string) {
        for (const tab of this.tabList) {
            tab.active = false;
            if (tab.route === activeRoute) {
                tab.active = true;
            }
        }
    }

    /**
     * Retrouve l'onglet actif
     * @return l'onglet actif
     */
    getActiveTab(): any {
        for (const tab of this.tabList) {
            if (tab.active) {
                return tab;
            }
        }
    }

    /**
     * Teste si l'onglet actif de la navBar correspond à un onglet "dossier visité"
     * @return vrai si c'est le cas, faux sinon
     */
    isVisitedPncTabSelected(): boolean {
        if (!this.tabList) {
            return false;
        }
        const activeTab = this.getActiveTab();
        return activeTab && activeTab.id === TabNavEnum.VISITED_PNC;
    }
}
