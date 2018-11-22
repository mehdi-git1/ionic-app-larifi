import { GlobalErrorEnum } from '../../../../core/enums/global-error.enum';
import { PinPadErrorEnum } from '../../../../core/enums/security/pin-pad-error.enum';
import { ViewController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';


@Component({
  selector: 'pin-pad-modal',
  templateUrl: 'pin-pad-modal.component.html'
})

export class PinPadModalComponent {

  modalType: string;
  errorType: PinPadErrorEnum | GlobalErrorEnum;

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
   * @param pinValue valeur du code pin
   */
  checkPinValue(pinValue) {
    if (pinValue.indexOf(this.padValueDefault) === -1) {
      this.viewController.dismiss(pinValue.join(''));
    }

  }

  /**
   * fonction passe-plat qui renvoi à l'appelant l'action faite
   * @param action Recupération de l'action et envoi vers le service
   */
  catchAction(action) {
    this.viewController.dismiss(action);
  }

}
