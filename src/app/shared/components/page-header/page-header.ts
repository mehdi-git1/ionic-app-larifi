import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'page-header',
  templateUrl: 'page-header.html'
})
export class PageHeaderComponent {

  @Input() showSettingsIcon = true;
  @Input() showRefreshIcon = false;

  @Output() refreshPage = new EventEmitter();

  constructor() {
  }

  /**
   * envoie un evenement pour recharger la page courante.
   */
  refresh() {
    this.refreshPage.emit();
  }

}
