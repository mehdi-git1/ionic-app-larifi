import { TranslateService} from '@ngx-translate/core';
import { ViewController } from 'ionic-angular';
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

import { PinPadTitle, PinPadType, GlobalError, PinPadErrorText } from './../../models/securitymodalType';

@Component({
  selector: 'pin-pad',
  templateUrl: 'pin-pad.html'
})

export class PinPadComponent implements OnInit{

  @Output() pinPadValue = new EventEmitter();
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
  listOfNumberPossible: Array<any>;

  // tableau de valeurs des valeurs entrées
  inputValueArray: Array<any>;

  constructor(
    public viewController: ViewController,
    public translateService: TranslateService
  ) {
  }

  ngOnInit(){
    this.pinTitle = this.translateService.instant(PinPadTitle[this.pinType]);
    this.errorText = this.errorType === GlobalError.none ? '' : this.translateService.instant(PinPadErrorText[this.errorType]);

    this.listOfNumberPossible = new Array(this.padNumberOfPossibleDigits);
    this.inputValueArray = new Array(this.padNumberOfDigits);
    this.inputValueArray.fill(this.padValueDefault);
  }

  addToInput(valeur){
    this.inputValueArray[this.inputValueArray.indexOf(this.padValueDefault)] = valeur;
    this.pinPadValue.emit(this.inputValueArray);
  }

  manageForgotten(){
    this.sendAction.emit('forgotten');
  }
}
