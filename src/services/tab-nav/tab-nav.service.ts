import { Injectable } from '@angular/core';

@Injectable()
export class TabNavService {

    listOfTab: Array<Object>;

    constructor() {
    }

    /**
     * Met à jour la liste des tab dans le service
     */
    setListOfTabs(listOfTabs) {
        this.listOfTab = listOfTabs;
    }


    /**
     * Retourne l'index de la tab selectionné en fonction de son ID
     */
    findTabIndex(idTab) {
        return this.listOfTab.findIndex((element) => element['id'] === idTab);
    }


}
