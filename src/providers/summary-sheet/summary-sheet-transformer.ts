import { SummarySheet } from './../../models/summarySheet';
import { Injectable } from '@angular/core';

@Injectable()
export class SummarySheetTransformerProvider {

  constructor() {
  }

  toSummarySheet(object: Blob, matricule: string): SummarySheet {
    const summarySheet = new SummarySheet();
    summarySheet.summarySheet = object;
    summarySheet.matricule = matricule;
    return summarySheet;
  }
}
