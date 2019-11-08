import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { GlobalErrorEnum } from '../../../../core/enums/global-error.enum';
import { PinPadErrorEnum } from '../../../../core/enums/security/pin-pad-error.enum';

@Component({
  selector: 'pin-pad-modal',
  templateUrl: 'pin-pad-modal.component.html',
  styleUrls: ['./pin-pad-modal.component.scss']
})

export class PinPadModalComponent {

  modalType: string;
  errorType: PinPadErrorEnum | GlobalErrorEnum;

  padValueDefault = '_';

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) {
    this.modalType = this.navParams.get('modalType');
    this.errorType = this.navParams.get('errorType');
  }

  /**
   * Fonction permettant de vérifier la valeur du pin
   * On envoi la valeur (en fermant la modal) seulement si les 4 caractéres ont été saisi
   * @param pinValue valeur du code pin
   */
  checkPinValue(pinValue) {
    if (pinValue.indexOf(this.padValueDefault) === -1) {
      this.modalCtrl.dismiss(pinValue.join(''));
    }

  }

  /**
   * fonction passe-plat qui renvoi à l'appelant l'action faite
   * @param action Recupération de l'action et envoi vers le service
   */
  catchAction(action) {
    this.modalCtrl.dismiss(action);
  }

}
