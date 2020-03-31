
import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'hr-document-action-menu',
  templateUrl: 'hr-document-action-menu.component.html',
  styleUrls: ['./hr-document-action-menu.component.scss']
})
export class HrDocumentActionMenuComponent {


  constructor(
    private popoverCtrl: PopoverController
  ) {
  }

  /**
   * Modifier un document RH
   */
  editHrDocument() {
    this.popoverCtrl.dismiss('hrDocument:create');
  }

  /**
   * Supprime un document RH
   */
  confirmDeleteHrDocument() {
    this.popoverCtrl.dismiss('hrDocument:delete');
  }
}
