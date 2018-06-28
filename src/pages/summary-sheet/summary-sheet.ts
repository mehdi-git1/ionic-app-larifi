import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Config } from '../../configuration/environment-variables/config';

@Component({
  selector: 'page-summary-sheet',
  templateUrl: 'summary-sheet.html',
})
export class SummarySheetPage {
  summaryLink: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private config: Config) {
    this.summaryLink = `${this.config.backEndUrl}/pnc_summary_sheets/${this.navParams.get('matricule')}`;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SummarySheetPage');
  }
}
