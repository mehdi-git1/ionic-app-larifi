import { Injectable } from '@angular/core';

import { StatutoryCertificateModel } from '../../models/statutory.certificate.model';

@Injectable({ providedIn: 'root' })
export class StatutoryCertificateTransformerService {

  constructor() {
  }

  toStatutoryCertificate(object: any): StatutoryCertificateModel {
    return !object ?
      null :
      new StatutoryCertificateModel().fromJSON(object);
  }
}
