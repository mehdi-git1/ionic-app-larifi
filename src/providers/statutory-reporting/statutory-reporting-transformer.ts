import { StatutoryReporting } from './../../models/statutoryReporting/statutory-reporting';
import { Injectable } from '@angular/core';

@Injectable()
export class StatutoryReportingTransformerProvider {

  constructor() {
  }

  toStatutoryReporting(object: any): StatutoryReporting {
    return !object ?
      null :
      new StatutoryReporting().fromJSON(object);
  }

}
