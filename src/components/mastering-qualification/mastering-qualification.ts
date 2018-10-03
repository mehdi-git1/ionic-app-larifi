import { Component } from '@angular/core';

/**
 * Generated class for the MasteringQualificationComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'mastering-qualification',
  templateUrl: 'mastering-qualification.html'
})
export class MasteringQualificationComponent {

  text: string;

  constructor() {
    console.log('Hello MasteringQualificationComponent Component');
    this.text = 'Hello World';
  }

}
