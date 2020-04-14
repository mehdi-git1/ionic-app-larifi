import * as _ from 'lodash';
import { LogbookEventModeEnum } from 'src/app/core/enums/logbook-event/logbook-event-mode.enum';
import { LogbookEventTypeEnum } from 'src/app/core/enums/logbook-event/logbook-event-type.enum';
import { PncModel } from 'src/app/core/models/pnc.model';
import { SecurityService } from 'src/app/core/services/security/security.service';
import { SessionService } from 'src/app/core/services/session/session.service';

import { Component } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

import { LogbookEventModel } from '../../../../core/models/logbook/logbook-event.model';

@Component({
  selector: 'logbook-event-action-menu',
  templateUrl: 'logbook-event-action-menu.component.html',
  styleUrls: ['./logbook-event-action-menu.component.scss']
})
export class LogbookEventActionMenuComponent {

  pnc: PncModel;
  logbookEvent: LogbookEventModel;
  logbookEventIndex: number;

  originLogbookEvent: LogbookEventModel;
  LogbookEventModeEnum = LogbookEventModeEnum;

  LogbookEventTypeEnum = LogbookEventTypeEnum;

  constructor(
    private navParams: NavParams,
    private popoverCtrl: PopoverController,
    private sessionService: SessionService,
    private securityService: SecurityService) {
    this.logbookEvent = this.navParams.get('logbookEvent');
    this.pnc = this.navParams.get('pnc');
    this.logbookEventIndex = this.navParams.get('logbookEventIndex');
  }

  /**
   * Ajoute un évènement lié
   */
  addLinkedEvent() {
    this.popoverCtrl.dismiss('logbookEvent:create');
  }

  /**
   * Lance le processus de modification d'un évènement
   */
  editLogbookEvent() {
    this.logbookEvent.mode = LogbookEventModeEnum.EDITION;
    this.originLogbookEvent = _.cloneDeep(this.logbookEvent);
    this.popoverCtrl.dismiss('logbookEvent:update');
  }

  /**
   * Lance le processus de suppression d'un évènement
   */
  confirmDeleteLogBookEvent() {
    this.popoverCtrl.dismiss('logbookEvent:delete');
  }

  /**
   * Ferme la popover
   */
  closePopover() {
    this.popoverCtrl.dismiss();
  }

  /**
   * Vérifie si le PNC connecté est le rédacteur de l'évènement, ou bien l'instructeur du pnc observé, ou bien son RDS
   * @return vrai si le PNC est redacteur, instructeur ou rds du pnc observé, faux sinon
   */
  canEditEvent(): boolean {
    const redactor = this.logbookEvent.redactor
      && this.sessionService.getActiveUser().matricule === this.logbookEvent.redactor.matricule;
    const instructor = this.pnc && this.pnc.pncInstructor
      && this.sessionService.getActiveUser().matricule === this.pnc.pncInstructor.matricule;
    const rds = this.pnc && this.pnc.pncRds && this.sessionService.getActiveUser().matricule === this.pnc.pncRds.matricule;
    const ccoIscvAdmin = this.pnc && this.securityService.isAdminCcoIscv(this.sessionService.getActiveUser());
    return redactor || instructor || rds || (ccoIscvAdmin
      && (this.logbookEvent.type === LogbookEventTypeEnum.CCO || this.logbookEvent.type === LogbookEventTypeEnum.ISCV));
  }

  /**
   * Vérifie si le PNC connecté peut modifier l'évènement
   * @return vrai si l'évènement est CCO/ISCV et que le PNC est admin CCO/ISCV ou si l'évènement n'est pas CCO/ISCV
   * et que le PNC peut éditer l'évènement, faux sinon
   */
  canModifyEvent(): boolean {
    if (this.logbookEvent.type === LogbookEventTypeEnum.CCO || this.logbookEvent.type === LogbookEventTypeEnum.ISCV) {
      return this.securityService.isAdminCcoIscv(this.sessionService.getActiveUser());
    }
    return this.canEditEvent();
  }

}
