import { ViewController, NavParams } from 'ionic-angular';
import { Component} from '@angular/core';

import { PinPadError, GlobalError } from './../../../models/securityModalType';

@Component({
  selector: 'pin-pad-modal',
  templateUrl: 'pin-pad-modal.html'
})

export class PinPadModal {

  modalType: string;
  errorType: PinPadError | GlobalError;

  padValueDefault = '_';

  constructor(
    public viewController: ViewController,
    public navParams: NavParams
  ) {
    this.modalType = navParams.get('modalType');
    this.errorType = navParams.get('errorType');
  }

  /**
   * Fonction permettant de vérifier la valeur du pin
   * On envoi la valeur (en fermant la modal) seulement si les 4 caractéres ont été saisi
   */
  checkPinValue(pinValue){
    if (pinValue.indexOf(this.padValueDefault) === -1){
      this.viewController.dismiss(pinValue.join(''));
     }

  }

  catchAction(action){
    this.viewController.dismiss(action);
  }

}
