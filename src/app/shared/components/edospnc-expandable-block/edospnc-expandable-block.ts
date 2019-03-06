import { Component, Input } from '@angular/core';

@Component({
  selector: 'edospnc-expandable-block',
  templateUrl: 'edospnc-expandable-block.html'
})
export class EdospncExpandableBlockComponent {

  matPanelHeaderHeight = '48px';

  @Input() title: string;

  @Input() emptyCondition: boolean;

  @Input() hideToggle = false;

  @Input() expanded = true;

  constructor() {
  }

  @Input()
  set mini(_mini: string) {
    if ('true' === _mini) {
      this.matPanelHeaderHeight = '32px';
    }
  }

  /**
   * Détermine si le panel est étendu par défaut
   * @return true si il est étendu, false sinon
   */
  isExpandedByDefault(): boolean {
    if (this.hideToggle) {
      return true;
    }
    return this.expanded;
  }

  /**
   * Détermine si l'expande/collapse est désactivé
   * @return true si il est désactivé, false sinon
   */
  isDisabled(): boolean {
    return this.hideToggle;
  }

 }
