import { Component, Input } from '@angular/core';
import { ReferentialItemLevelModel } from '../../../../core/models/eobservation/eobservation-referential-item-level.model';
import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'priority-dropdown-list',
  templateUrl: 'priority-dropdown-list.component.html'
})
export class PriorityDropdownListComponent {


  prioritized: boolean;
  priority: boolean;
  noPriority: boolean;

  constructor(private navParams: NavParams, public viewCtrl: ViewController) {
    this.prioritized = this.navParams.get('prioritized');
    this.priority = this.navParams.get('priority');
    this.noPriority = this.navParams.get('noPriority');
  }

  /**
   * Valide les éléments cochés
   */
  confirm() {
    // envoie les valeurs cochées
    this.viewCtrl.dismiss({ prioritized: this.prioritized, priority: this.priority, noPriority: this.noPriority});
  }

  /**
   * Ferme la popover
   */
  closePopover() {
    this.viewCtrl.dismiss();
  }
}
