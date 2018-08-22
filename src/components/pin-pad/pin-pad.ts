import { ViewController } from 'ionic-angular';
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pin-pad',
  templateUrl: 'pin-pad.html'
})

export class PinPadComponent implements OnInit{

  @Output() pinPadValue = new EventEmitter();

  @Input() padValueDefault = '_';
  @Input() padNumberOfDigits = 4;
  @Input() padNumberOfPossibleDigits = 10;
  @Input() pinTitle = '';

  // tableau vide permettant d'afficher les chiffres en boucle
  listOfNumberPossible: Array<any>;

  // tableau de valeurs des valeurs entrées
  inputValueArray: Array<any>;

  constructor(public viewController: ViewController) {
  }

  ngOnInit(){
    this.listOfNumberPossible = new Array(this.padNumberOfPossibleDigits);
    this.inputValueArray = new Array(this.padNumberOfDigits);
    this.inputValueArray.fill(this.padValueDefault);
  }

  addToInput(valeur){
    this.inputValueArray[this.inputValueArray.indexOf(this.padValueDefault)] = valeur;
    this.pinPadValue.emit(this.inputValueArray);
  }
}
