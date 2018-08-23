import { ViewController, NavParams } from 'ionic-angular';
import { Component} from '@angular/core';


@Component({
  selector: 'pin-pad-modal',
  templateUrl: 'pin-pad-modal.html'
})

export class PinPadModal {

  modalType: string;

  constructor(
    public viewController: ViewController,
    public navParams: NavParams
  ) {
    this.modalType = navParams.get('typeModal');
  }

  checkPinValue(pinValue){
    console.log(pinValue);

    // Si le tableau est rempli au max
    if (pinValue.indexOf('_') === -1){
      // On check si le mot de passe est le bon et aprés si c'est le cas on renvoi vers l'ancienne page
      this.viewController.dismiss(pinValue.join(''));
     }

  }

  catchAction(action){
    this.viewController.dismiss(action);
  }

}
