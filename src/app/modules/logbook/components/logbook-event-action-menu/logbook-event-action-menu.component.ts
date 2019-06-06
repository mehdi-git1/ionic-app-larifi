import { Component, Input } from '@angular/core';
import { ReferentialItemLevelModel } from '../../../../core/models/eobservation/eobservation-referential-item-level.model';
import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';
import { NavParams, ViewController } from 'ionic-angular';
import { LogbookEventModel } from '../../../../core/models/logbook/logbook-event.model';

@Component({
  selector: 'logbook-event-action-menu',
  templateUrl: 'logbook-event-action-menu.component.html'
})
export class LogbookEventActionMenuComponent {

  logbookEvent: LogbookEventModel;

  constructor(private navParams: NavParams, public viewCtrl: ViewController) {
    this.logbookEvent = this.navParams.get('logbookEvent');
  }

  /**
   * Ferme la popover
   */
  closePopover() {
    this.viewCtrl.dismiss();
  }
}
