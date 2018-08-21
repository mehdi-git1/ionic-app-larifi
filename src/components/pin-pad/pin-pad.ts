import { ViewController } from 'ionic-angular';
import { Component} from '@angular/core';

@Component({
  selector: 'pin-pad-home',
  templateUrl: 'pin-pad.html'
})

export class PinPadModal {


  // tableau vide permettant d'afficher les chiffres en boucle
  emptyArray = new Array(10);

  // tableau de valeurs des valeurs entrées
  inputValueArray = new Array(4);

  constructor(public viewController: ViewController) {
    this.inputValueArray.fill('_');
  }

  addToInput(valeur){
    this.inputValueArray[this.inputValueArray.indexOf('_')] = valeur;

    // Si le tableau est rempli au max
     if (this.inputValueArray.indexOf('_') === -1){
      // On check si le mot de passe est le bon et aprés si c'est le cas on renvoi vers l'ancienne page
        this.viewController.dismiss();
     }

  }
}
