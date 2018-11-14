import { Injectable } from '@angular/core';

@Injectable()
export class TabNavService {

    listOfTab: Array<Object>;

    constructor() {
    }

    /**
     * Met à jour la liste des tab dans le service
     * Ce tableau ne peut pas être créé dans le service, dû au fait que l'on appelle des pages pour la création,
     * ce qui créé des redondance lors de l'appel de ce service par ces mêmes pages
     * @param listOfTabs liste des tabs créés
     */
    setListOfTabs(listOfTabs) {
        this.listOfTab = listOfTabs;
    }


    /**
     * Retourne l'index de la tab selectionné en fonction de son ID
     * @param idTab Nom de la tab voulu (correspond à l'ID de la liste => enum navTab)
     */
    findTabIndex(idTab) {
        return this.listOfTab.findIndex((element) => element['id'] === idTab);
    }


}
