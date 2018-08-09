import { Component } from '@angular/core';
import { NavParams, IonicPage } from 'ionic-angular';

import { SummarySheetProvider } from '../../providers/summary-sheet/summary-sheet';

@Component({
  selector: 'page-summary-sheet',
  templateUrl: 'summary-sheet.html',
})

export class SummarySheetPage {

  public previewSrc: string = null;
  private summarySheet: any;
  loading = true;

  constructor(
    public navParams: NavParams,
    private summarySheetProvider: SummarySheetProvider) {
  }

  ionViewDidEnter() {
    const matricule = this.navParams.get('matricule');
    this.summarySheetProvider.getSummarySheet(matricule).then(summarySheet => {
      try {
        if (summarySheet && summarySheet.summarySheet) {
          this.previewSrc = URL.createObjectURL(summarySheet.summarySheet);
        }
        this.loading = false;
      } catch (error) {
        console.log('createObjectURL error:' + error);
      }
    }, error => {
      console.log('getSummarySheet error:' + error);
    });
  }

  /**
    * Décode un Blob dans le FileReader global
    * @param matricule le Blob à decoder
    */
  public setPreviewFromFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = (e: any) => {
      this.previewSrc = e.target.result;
    };
    reader.readAsArrayBuffer(file);
  }
}
