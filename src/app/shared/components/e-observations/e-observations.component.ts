import { Component, Input } from '@angular/core';

@Component({
  selector: 'e-observations',
  templateUrl: 'e-observations.component.html'
})

export class EObservationsComponent {

  matPanelHeaderHeight = 'auto';

  @Input() EObservations = [
    {
      date: new Date(),
      type: 'EHST',
      writer: '14537165 - Gil Scavone'
    },
    {
      date: new Date(),
      type: 'AEV',
      writer: '33987079 - Derquenne'
    }
  ];


  constructor() {
  }
}
