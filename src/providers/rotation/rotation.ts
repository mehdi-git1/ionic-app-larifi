import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RotationProvider {

  constructor(public http: HttpClient) {
  }

  getUpcomingRotations(): any {
    return [{
      number: 'JBT29305',
      departureDate: '2018-05-22T10:20:00Z',
      flights: [
        {
          company: 'AF',
          number: '6100',
          departureDate: '2018-05-22T10:20:00Z',
          departureStation: 'ORY',
          arrivalStation: 'TLS',
          planeType: '319'
        },
        {
          company: 'AF',
          number: '6111',
          departureDate: '2018-05-22T13:20:00Z',
          departureStation: 'TLS',
          arrivalStation: 'ORY',
          planeType: '319'
        },
        {
          company: 'AF',
          number: '6100',
          departureDate: '2018-05-22T10:20:00Z',
          departureStation: 'ORY',
          arrivalStation: 'TLS',
          planeType: '319'
        },
        {
          company: 'AF',
          number: '6111',
          departureDate: '2018-05-22T13:20:00Z',
          departureStation: 'TLS',
          arrivalStation: 'ORY',
          planeType: '319'
        }
      ]
    },
    {
      number: 'JGT48108',
      departureDate: '2018-05-24T10:20:00Z',
      flights: [
        {
          company: 'AF',
          number: '6250',
          departureDate: '2018-05-22T10:20:00Z',
          departureStation: 'ORY',
          arrivalStation: 'BOD',
          planeType: '318'
        },
        {
          company: 'AF',
          number: '6257',
          departureDate: '2018-05-22T13:20:00Z',
          departureStation: 'BOD',
          arrivalStation: 'ORY',
          planeType: '318'
        }
      ]
    },
    {
      number: 'JFT45248',
      departureDate: '2018-05-26T10:20:00Z',
      flights: [
        {
          company: 'AF',
          number: '6200',
          departureDate: '2018-05-22T10:20:00Z',
          departureStation: 'ORY',
          arrivalStation: 'NCE',
          planeType: '340'
        },
        {
          company: 'AF',
          number: '6211',
          departureDate: '2018-05-22T13:20:00Z',
          departureStation: 'NCE',
          arrivalStation: 'ORY',
          planeType: '340'
        }
      ]
    }
    ];
  }
}
