import { MatriculesModel } from './../../../../core/models/matricules.model';
import { LogbookEventDetailsPage } from './../../pages/logbook-event-details/logbook-event-details.page';
import { Component, Input } from '@angular/core';
import { ReferentialItemLevelModel } from '../../../../core/models/eobservation/eobservation-referential-item-level.model';
import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';
import { NavParams, ViewController, NavController } from 'ionic-angular';
import { LogbookEventModel } from '../../../../core/models/logbook/logbook-event.model';

@Component({
  selector: 'logbook-event-action-menu',
  templateUrl: 'logbook-event-action-menu.component.html'
})
export class LogbookEventActionMenuComponent {

  logbookEvent: LogbookEventModel;

  navCtrl: NavController;

  constructor(private navParams: NavParams,
    public viewCtrl: ViewController) {
    this.logbookEvent = this.navParams.get('logbookEvent');
    this.navCtrl = this.navParams.get('navCtrl');
  }

  /**
   * Ajoute un évènement lié
   */
  addLinkedEvent() {
    this.navCtrl.push(LogbookEventDetailsPage, { matricule: this.logbookEvent.pnc.matricule, groupId: this.logbookEvent.groupId, createLinkedEvent: true });
    this.viewCtrl.dismiss();
  }

  /**
   * Ajoute un évènement lié
   */
  addLinkedEvent() {
    this.navCtrl.push(LogbookEventDetailsPage, { matricule: this.logbookEvent.pnc.matricule, groupId: this.logbookEvent.groupId, createLinkedEvent: true });
    this.viewCtrl.dismiss();
  }

  /**
   * Ferme la popover
   */
  closePopover() {
    this.viewCtrl.dismiss();
  }
}
