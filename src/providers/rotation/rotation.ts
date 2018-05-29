import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RotationProvider {

  constructor() {
  }

  getUpcomingRotations(): any {
    return [{
      number: 'JBT29305',
      departureDate: '2018-05-22T10:20:00Z'
    },
    {
      number: 'JGT48108',
      departureDate: '2018-05-24T10:20:00Z'
    },
    {
      number: 'JFT45248',
      departureDate: '2018-05-26T10:20:00Z'
    }
    ];
  }
}
