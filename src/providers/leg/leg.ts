import { Rotation } from './../../models/rotation';
import { Leg } from './../../models/leg';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LegProvider {

  constructor() {
  }

  /**
   * Récupère les tronçons d'une rotation
   * @param rotation la rotation dont on souhaite récupérer les tronçons
   * @return la liste des tronçons de la rotation
   */
  getRotationLegs(rotation: Rotation): any {
    return [
      {
        company: 'AF',
        number: '6100',
        departureDate: '2018-05-22T10:20:00Z',
        departureStation: 'ORY',
        arrivalStation: 'TLS',
        aircraftType: '319'
      },
      {
        company: 'AF',
        number: '6111',
        departureDate: '2018-05-22T13:20:00Z',
        departureStation: 'TLS',
        arrivalStation: 'ORY',
        aircraftType: '319'
      },
      {
        company: 'AF',
        number: '6100',
        departureDate: '2018-05-22T10:20:00Z',
        departureStation: 'ORY',
        arrivalStation: 'TLS',
        aircraftType: '319'
      },
      {
        company: 'AF',
        number: '6111',
        departureDate: '2018-05-22T13:20:00Z',
        departureStation: 'TLS',
        arrivalStation: 'ORY',
        aircraftType: '319'
      }
    ];
  }

}
