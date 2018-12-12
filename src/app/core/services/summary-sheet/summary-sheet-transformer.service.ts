import { Injectable } from '@angular/core';

import { SummarySheetModel } from '../../models/summary.sheet.model';

@Injectable()
export class SummarySheetTransformerService {

  constructor() {
  }

  toSummarySheetFromBlob(object: string, matricule: string): SummarySheetModel {
    const summarySheet = new SummarySheetModel();
    summarySheet.summarySheet = object;
    summarySheet.matricule = matricule;
    return summarySheet;
  }

  toSummarySheet(object: any): SummarySheetModel {
    return !object ?
      null :
      new SummarySheetModel().fromJSON(object);
  }
}
