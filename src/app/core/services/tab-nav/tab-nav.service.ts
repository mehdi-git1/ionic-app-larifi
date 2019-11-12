import { PncService } from 'src/app/core/services/pnc/pnc.service';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Events, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import {
    CareerObjectiveListPage
} from '../../../modules/development-program/pages/career-objective-list/career-objective-list.page';
import {
    UpcomingFlightListPage
} from '../../../modules/flight-activity/pages/upcoming-flight-list/upcoming-flight-list.page';
import {
    HelpAssetListPage
} from '../../../modules/help-asset/pages/help-asset-list/help-asset-list.page';
import { PncHomePage } from '../../../modules/home/pages/pnc-home/pnc-home.page';
import { PncSearchPage } from '../../../modules/pnc-team/pages/pnc-search/pnc-search.page';
import { TabNavEnum } from '../../enums/tab-nav.enum';
import { PncModel } from '../../models/pnc.model';
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
                page: this.sessionService.getActiveUser().isManager ? PncHomePage : CareerObjectiveListPage,
                icon: 'md-home',
                route: 'home',
                display: true
            },
            {
                id: TabNavEnum.PNC_SEARCH_PAGE,
                title: this.translateService.instant('GLOBAL.MY_PNC_TEAM'),
                page: PncSearchPage,
                icon: 'md-contacts',
                route: 'search',
                display: this.securityService.isManager()
            },
            {
                id: TabNavEnum.UPCOMING_FLIGHT_LIST_PAGE,
                title: this.translateService.instant('GLOBAL.MY_UPCOMING_FLIGHT'),
                page: UpcomingFlightListPage,
                icon: 'md-jet',
                route: 'flight',
                display: this.securityService.isManager()
            },
            {
                id: TabNavEnum.VISITED_PNC,
                title: ' ',
                page: CareerObjectiveListPage,
                icon: 'md-person',
                route: 'visit',
                display: false
            },
            {
                id: TabNavEnum.HELP_ASSET_LIST_PAGE,
                title: this.translateService.instant('GLOBAL.MY_HELP_CENTER'),
                page: HelpAssetListPage,
                icon: 'md-help-circle',
                route: 'help',
                display: this.securityService.isManager()
            }
        ];

    }

    /**
     * Il est impossible de gérer ce traitement dans un service (problème d'injection inconnu). On gère donc cela avec un système d'events..
     */
    handleEdossierVisit(): void {
        this.events.subscribe('EDossier:visited', (pnc) => {
            if (this.sessionService.isActiveUser(pnc)) {
                this.sessionService.visitedPnc = undefined;
                this.router.navigate(['tabs', 'home']);
            } else {
                this.loadVisitedPnc(pnc.matricule).then(() => {
                    if (pnc.manager) {
                        this.router.navigate(['tabs', 'visit', this.sessionService.visitedPnc.matricule, 'professional-level']);
                    } else {
                        this.router.navigate(['tabs', 'visit', this.sessionService.visitedPnc.matricule, 'career-objective']);
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
        return this.loadingCtrl.create().then(loading => {
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
        this.getTab(TabNavEnum.VISITED_PNC).title = `${pnc.firstName} ${pnc.lastName}`;
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
