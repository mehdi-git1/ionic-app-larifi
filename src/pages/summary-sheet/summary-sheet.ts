import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { SummarySheetProvider } from '../../providers/summary-sheet/summary-sheet';

@Component({
  selector: 'page-summary-sheet',
  templateUrl: 'summary-sheet.html',
})

export class SummarySheetPage {
  summaryLink: string;

  constructor(public navParams: NavParams, private summarySheetProvider: SummarySheetProvider) {
    this.summaryLink = this.summarySheetProvider.getLink(`${this.navParams.get('matricule')}`);
  }
}
