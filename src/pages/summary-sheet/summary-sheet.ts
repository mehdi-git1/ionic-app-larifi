import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { SummarySheetProvider } from '../../providers/summary-sheet/summary-sheet';

@Component({
  selector: 'page-summary-sheet',
  templateUrl: 'summary-sheet.html',
})

export class SummarySheetPage {
  summarySheet;
  reader = new FileReader();
  pdfNull = false;

  constructor(public navParams: NavParams, private summarySheetProvider: SummarySheetProvider) {
  }

  ionViewCanEnter() {
    this.summarySheetProvider.getSummarySheet(`${this.navParams.get('matricule')}`).then(blob => {
      if (blob.size === 0) {
        this.pdfNull = true;
      } else {
        this.getSummarySheet(blob).then(() => {
          this.summarySheet = { data: this.reader.result };
        });
      }
    }, error => {
      this.pdfNull = true;
    });
  }

  getSummarySheet(blob: Blob) {
    return new Promise((resolve, reject) => {
      this.reader.onload = resolve;
      this.reader.readAsBinaryString(blob);
    });
  }

}
