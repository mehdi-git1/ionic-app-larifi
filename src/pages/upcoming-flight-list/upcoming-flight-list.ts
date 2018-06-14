import { PncProvider } from './../../providers/pnc/pnc';
import { Rotation } from './../../models/rotation';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RotationProvider } from '../../providers/rotation/rotation';

@Component({
  selector: 'page-upcoming-flight-list',
  templateUrl: 'upcoming-flight-list.html',
})
export class UpcomingFlightListPage {

  upcomingRotations: Rotation[];
  lastPerformedRotation: Rotation;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private pncProvider: PncProvider,
    private rotationProvider: RotationProvider) {
  }

  ionViewDidLoad() {
    this.pncProvider.getLastPerformedRotation(this.navParams.get('matricule')).then(lastPerformedRotation => {
      this.lastPerformedRotation = lastPerformedRotation;
    }, error => { });

    this.pncProvider.getUpcomingRotations(this.navParams.get('matricule')).then(upcomingRotations => {
      this.upcomingRotations = upcomingRotations;
    }, error => { });
  }

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return this.lastPerformedRotation !== undefined && this.upcomingRotations !== undefined;
  }
}
