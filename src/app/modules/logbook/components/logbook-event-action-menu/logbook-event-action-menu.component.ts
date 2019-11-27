import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavParams, PopoverController } from '@ionic/angular';

import { LogbookEventModel } from '../../../../core/models/logbook/logbook-event.model';

@Component({
  selector: 'logbook-event-action-menu',
  templateUrl: 'logbook-event-action-menu.component.html',
  styleUrls: ['./logbook-event-action-menu.component.scss']
})
export class LogbookEventActionMenuComponent {

  logbookEvent: LogbookEventModel;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private navParams: NavParams,
    private popoverCtrl: PopoverController) {
    this.logbookEvent = this.navParams.get('logbookEvent');
  }

  /**
   * Ajoute un évènement lié
   */
  addLinkedEvent() {
    this.popoverCtrl.dismiss('logbookEvent:create');
  }

  /**
   * Ferme la popover
   */
  closePopover() {
    this.popoverCtrl.dismiss();
  }
}
