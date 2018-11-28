import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PncModel } from '../../../core/models/pnc.model';
import { SessionService } from '../../../core/services/session/session.service';

@Component({
  selector: 'page-header',
  templateUrl: 'page-header.component.html'
})
export class PageHeaderComponent {

  @Input() showSettingsIcon = true;
  @Input() showRefreshIcon = false;

  @Input() pnc: PncModel;

  @Output() refreshPage = new EventEmitter();

  constructor(private sessionService: SessionService) {
  }

  /**
   * envoie un evenement pour recharger la page courante.
   */
  refresh() {
    this.refreshPage.emit();
  }

    /**
     * Vérifie que la page courante est la homepage de la personne connectée
     * @return vrai si c'est le cas, faux sinon
     */
    isMyHome(): boolean {
      return this.sessionService.isMyHome(this.pnc);
  }
}
