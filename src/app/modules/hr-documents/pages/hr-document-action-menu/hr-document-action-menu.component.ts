import { NavController, NavParams, ViewController } from 'ionic-angular';

import { Component } from '@angular/core';

import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';
import { HrDocumentCreatePage } from '../hr-document-create/hr-document-create.page';

@Component({
  selector: 'hr-document-action-menu',
  templateUrl: 'hr-document-action-menu.component.html'
})
export class HrDocumentActionMenuComponent {

  hrDocument: HrDocumentModel;

  navCtrl: NavController;

  constructor(private navParams: NavParams,
    public viewCtrl: ViewController) {
    this.hrDocument = this.navParams.get('hrDocument');
    this.navCtrl = this.navParams.get('navCtrl');
  }

  /**
   * Modifier un document RH
   */
  editHrDocument() {
    this.navCtrl.push(HrDocumentCreatePage, { mode: HrDocumentModeEnum.EDITION, hrDocumentId: this.hrDocument.techId });
    this.viewCtrl.dismiss();
  }

  /**
   * Ferme la popover
   */
  closePopover() {
    this.viewCtrl.dismiss();
  }
}
