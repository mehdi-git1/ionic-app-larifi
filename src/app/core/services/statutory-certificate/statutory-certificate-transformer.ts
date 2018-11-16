import { StatutoryCertificate } from '../../models/statutoryCertificate';
import { Injectable } from '@angular/core';

@Injectable()
export class StatutoryCertificateTransformerProvider {

  constructor() {
  }

  toStatutoryCertificate(object: any): StatutoryCertificate {
    return !object ?
      null :
      new StatutoryCertificate().fromJSON(object);
  }
}
