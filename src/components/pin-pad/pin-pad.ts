import { PinPadErrorText } from './../../models/pinPadErrorText';
import { GlobalError } from './../../models/globalError';
import { PinPadTitle } from './../../models/pinPadTitle';
import { PinPadType } from './../../models/pinPadType';
import { TranslateService } from '@ngx-translate/core';
import { ViewController } from 'ionic-angular';
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';


@Component({
  selector: 'pin-pad',
  templateUrl: 'pin-pad.html'
})

export class PinPadComponent implements OnInit {

  @Output() pinPadEntered = new EventEmitter();
  @Output() sendAction = new EventEmitter();

  @Input() padValueDefault = '_';
  @Input() padNumberOfDigits = 4;
  @Input() padNumberOfPossibleDigits = 10;
  @Input() pinType = '';
  @Input() errorType = '';

  pinTitle = '';
  errorText = '';

  pinPadType = PinPadType;

  // tableau vide permettant d'afficher les chiffres en boucle
  listOfPossibleNumber: Array<any>;

  // tableau de valeurs des valeurs entrées (code pin)
  inputValueArray: Array<any>;

  constructor(
    private viewController: ViewController,
    private translateService: TranslateService
  ) {
  }

  /**
   * On initialise différents données ici
   * Le bon titre traduit
   * le text d'erreur
   * Le nombre de chiffre
   * et on remplis le code (tableau) par des valeurs par défaut
   */
  ngOnInit() {
    this.pinTitle = this.translateService.instant(PinPadTitle[this.pinType]);
    this.errorText = this.errorType === GlobalError.none ? '' : this.translateService.instant(PinPadErrorText[this.errorType]);

    this.listOfPossibleNumber = new Array(this.padNumberOfPossibleDigits);
    this.inputValueArray = new Array(this.padNumberOfDigits);
    this.inputValueArray.fill(this.padValueDefault);
  }

  /**
   * Fonction permettant de récupérer l'information entrée et
   * l'envoi pour traitement
   * @param valeur valeur entrée par l'utilisateur
   */
  addToInput(valeur) {
    this.inputValueArray[this.inputValueArray.indexOf(this.padValueDefault)] = valeur;
    this.pinPadEntered.emit(this.inputValueArray);
  }

  /**
   * Fonction définissant l'action à faire lors du click sur pin oublié
   */
  manageForgotten() {
    this.sendAction.emit('forgotten');
  }


  /**
   * Fonction définissant l'action à faire lors du click sur annuler
   */
  manageCancel(){
    this.sendAction.emit('cancel');
  }

  /**
   * Fonction permettant de gérer l'effacement du dernier caractère entré
   */
  manageErase(){
    this.inputValueArray[this.inputValueArray.indexOf(this.padValueDefault) - 1] = this.padValueDefault;
    this.pinPadEntered.emit(this.inputValueArray);
  }

  /**
   * Affichae ou non du bouton effacer
   */
  isInvisible(){
    return this.inputValueArray.indexOf(this.padValueDefault) < 1;
  }

}
