import { Injectable } from '@angular/core';

import { SummarySheetModel } from '../../models/summary.sheet.model';
import { Utils } from '../../../shared/utils/utils';
import { FileTypeEnum } from '../../enums/file-type.enum';

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

  /**
   * Transforme une summarySheet en url de type blob
   * @param summarySheet fiche synthèse à transformer
   */
  toSummarySheetFile(summarySheet: SummarySheetModel): string {
    let previewSrc;
    try {
      if (summarySheet && summarySheet.summarySheet) {
        const file = new Blob([Utils.base64ToArrayBuffer(summarySheet.summarySheet)], { type: 'application/pdf' });
        previewSrc = URL.createObjectURL(file);
      } else {
        previewSrc = null;
      }
    } catch (error) {
      console.error('createObjectURL error:' + error);
    }
    return previewSrc;
  }

}
