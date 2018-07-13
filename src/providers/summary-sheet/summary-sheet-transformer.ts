import { SummarySheet } from './../../models/summarySheet';
import { Injectable } from '@angular/core';

@Injectable()
export class SummarySheetTransformerProvider {

  constructor() {
  }

  toSummarySheetFromBlob(object: Blob, matricule: string): SummarySheet {
    const summarySheet = new SummarySheet();
    summarySheet.summarySheet = object;
    summarySheet.matricule = matricule;
    return summarySheet;
  }

  toSummarySheet(object: any): SummarySheet {
    return !object ?
      object :
      new SummarySheet().fromJSON(object);
  }
}
