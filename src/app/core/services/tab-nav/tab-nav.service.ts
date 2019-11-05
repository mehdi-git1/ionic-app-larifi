import { Injectable } from '@angular/core';

import { TabNavEnum } from '../../enums/tab-nav.enum';

@Injectable({ providedIn: 'root' })
export class TabNavService {

    listOfTab: Array<any>;

    constructor() {
    }

    /**
     * Met à jour la liste des tab dans le service
     * Ce tableau ne peut pas être créé dans le service, dû au fait que l'on appelle des pages pour la création,
     * ce qui créé des redondances lors de l'appel de ce service par ces mêmes pages
     * @param listOfTabs liste des tabs créés
     */
    setListOfTabs(listOfTabs) {
        this.listOfTab = listOfTabs;
    }


    /**
     * Retourne l'index de la tab selectionné en fonction de son ID
     * @param idTab Nom de la tab voulu (correspond à l'ID de la liste => enum navTab)
     * @return index du tab demandé
     */
    getTabIndex(idTab): number {
        return this.listOfTab.findIndex((element) => element['id'] === idTab);
    }

    /**
     * Retourne l'onglet demandé
     * @param tabNav Id du tab voulu
     * @return l'onglet demandé
     */
    getTab(tabNav: TabNavEnum): any {
        return this.listOfTab[this.getTabIndex(tabNav)];
    }

    /**
     * Sauvegarde l'onglet actif
     * @param activeRoute la route active
     */
    setActiveTab(activeRoute: string) {
        for (const tab of this.listOfTab) {
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
        for (const tab of this.listOfTab) {
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
        if (!this.listOfTab) {
            return false;
        }
        const activeTab = this.getActiveTab();
        return activeTab && activeTab.id === TabNavEnum.VISITED_PNC;
    }

}
