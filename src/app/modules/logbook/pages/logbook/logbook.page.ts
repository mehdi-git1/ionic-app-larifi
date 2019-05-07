import { NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { LogbookEditPage } from '../logbook-edit/logbook-edit.page';

@Component({
    selector: 'log-book',
    templateUrl: 'logbook.page.html',
})
export class LogbookPage {

    constructor(public navCtrl: NavController,
        public navParams: NavParams){
    }

    /**
     * Dirige vers la page d'édition d'un évènement du journal de bord
     */
    goToLogbookCreation() {
        this.navCtrl.push(LogbookEditPage);
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return true;
    }
}

