import { LogbookCategoryEnum } from './../../../../core/models/logbook/logbook-category-enum';
import { LogbookEventModel } from './../../../../core/models/logbook/logbook-event.model';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'logbook-edit',
    templateUrl: 'logbook-edit.page.html',
})
export class LogbookEditPage {

    LogbookCategoryEnum = LogbookCategoryEnum;

    logbookEvent: LogbookEventModel;

    constructor(){
        this.logbookEvent = new LogbookEventModel();
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        //return this.logbookEvent !== undefined && this.logbookEvent !== null;
        return true;
    }

}
