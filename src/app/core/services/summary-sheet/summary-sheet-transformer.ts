import { SummarySheet } from '../../models/summarySheet';
import { Injectable } from '@angular/core';

@Injectable()
export class SummarySheetTransformerProvider {

  constructor() {
  }

  toSummarySheetFromBlob(object: string, matricule: string): SummarySheet {
    const summarySheet = new SummarySheet();
    summarySheet.summarySheet = object;
    summarySheet.matricule = matricule;
    return summarySheet;
  }

  toSummarySheet(object: any): SummarySheet {
    return !object ?
      null :
      new SummarySheet().fromJSON(object);
  }
}
