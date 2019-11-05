import { Component } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'priority-dropdown-list',
  templateUrl: 'priority-dropdown-list.component.html',
  styleUrls: ['./priority-dropdown-list.component.scss']
})
export class PriorityDropdownListComponent {

  prioritized: boolean;
  priority: boolean;
  noPriority: boolean;

  constructor(private navParams: NavParams, public popoverCtrl: PopoverController) {
    this.prioritized = this.navParams.get('prioritized');
    this.priority = this.navParams.get('priority');
    this.noPriority = this.navParams.get('noPriority');
  }

  /**
   * Valide les éléments cochés
   */
  confirm() {
    // envoie les valeurs cochées
    this.popoverCtrl.dismiss({ prioritized: this.prioritized, priority: this.priority, noPriority: this.noPriority });
  }

  /**
   * Ferme la popover
   */
  closePopover() {
    this.popoverCtrl.dismiss();
  }
}
