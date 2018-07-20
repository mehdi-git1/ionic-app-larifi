import { Component } from '@angular/core';
import { NavParams, IonicPage } from 'ionic-angular';
import { SummarySheetProvider } from '../../providers/summary-sheet/summary-sheet';

@IonicPage({
  name: 'SummarySheetPage',
  segment: 'summarySheet/:matricule',
  defaultHistory: ['PncHomePage']
})

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
    return new Promise((resolve, reject) => {
      this.summarySheetProvider.getSummarySheet(this.navParams.get('matricule')).then(summarySheet => {
        if (summarySheet.summarySheet.size === 0) {
          this.pdfNull = true;
          resolve();
        } else {
          this.getSummarySheet(summarySheet.summarySheet).then(() => {
            this.summarySheet = { data: this.reader.result };
            resolve();
          });
        }
      }, error => {
        this.pdfNull = true;
        resolve();
      });
    });
  }

  /**
    * Décode un Blob dans le FileReader global
    * @param matricule le Blob à decoder
    * @return Une promesse resolue quand tout le Blob a été decodé
    */
  getSummarySheet(blob: Blob) {
    return new Promise((resolve, reject) => {
      this.reader.onload = resolve;
      this.reader.readAsBinaryString(blob);
    });
  }
}
