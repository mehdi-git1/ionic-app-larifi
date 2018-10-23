import { Stage } from './../../models/statutoryReporting/stage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-statutory-reporting',
  templateUrl: 'statutory-reporting.html',
})
export class StatutoryReportingPage {

  stagesList: Stage[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.stagesList = [{ date: new Date(), code: 'FPX', label: 'Formation CCP', result: '-' },
    { date: new Date(), code: 'FPX', label: 'Formation CCP', result: '-' },
    { date: new Date(), code: 'FPX', label: 'Formation CCP', result: '-' }];

  }

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return typeof this.stagesList !== 'undefined';
  }

}
