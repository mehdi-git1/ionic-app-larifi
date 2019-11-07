
import { Component } from '@angular/core';
import { NavParams } from '@ionic/angular';

import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';

@Component({
  selector: 'hr-document-action-menu',
  templateUrl: 'hr-document-action-menu.component.html'
})
export class HrDocumentActionMenuComponent {

  hrDocument: HrDocumentModel;


  constructor(
    private navParams: NavParams,
    // private viewCtrl: ViewController
  ) {
    this.hrDocument = this.navParams.get('hrDocument');
  }

  /**
   * Modifier un document RH
   */
  editHrDocument() {
    // this.navCtrl.push(HrDocumentCreatePage, { mode: HrDocumentModeEnum.EDITION, hrDocumentId: this.hrDocument.techId });
    // this.viewCtrl.dismiss();
  }

  /**
   * Ferme la popover
   */
  closePopover() {
    // this.viewCtrl.dismiss();
  }
}
