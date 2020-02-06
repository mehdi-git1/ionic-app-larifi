import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'edospnc-expandable-block',
  templateUrl: 'edospnc-expandable-block.html',
  styleUrls: ['./edospnc-expandable-block.scss']
})
export class EdospncExpandableBlockComponent {

  matPanelHeaderHeight = '48px';

  @Input() title: string;

  @Input() emptyCondition: boolean;

  @Input() hideToggle = false;

  @Input() expanded = true;

  @Input() legendComponent: any;

  constructor(
    private popoverCtrl: PopoverController
  ) { }

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

  /**
   * Détermine si une légende doit être affichée (si on a un composant de légende disponible)
   * @return vrai si c'est le cas, faux sinon
   */
  isLegendAvailable(): boolean {
    return this.legendComponent !== undefined;
  }

  /**
   * Affiche le popup de légende
   * @param event l'événement déclencheur
   */
  showLegend(event: any) {
    this.popoverCtrl.create({
      component: this.legendComponent,
      event: event,
      translucent: true
    }).then(popover => {
      popover.present();
    });
  }

}
