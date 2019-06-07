import { Injectable } from '@angular/core';

@Injectable()
export class TabNavService {

    tabList: Array<Object>;

    constructor() {
    }

    /**
     * Met à jour la liste des tab dans le service
     * Ce tableau ne peut pas être créé dans le service, dû au fait que l'on appelle des pages pour la création,
     * ce qui créé des redondances lors de l'appel de ce service par ces mêmes pages
     * @param tabList liste des tabs créés
     */
    setTabList(tabList) {
        this.tabList = tabList;
    }


    /**
     * Retourne l'index de la tab selectionné en fonction de son ID
     * @param idTab Nom de la tab voulu (correspond à l'ID de la liste => enum navTab)
     * @return index du tab demandé
     */
    findTabIndex(idTab): number {
        return this.tabList.findIndex((element) => element['id'] === idTab);
    }

}
