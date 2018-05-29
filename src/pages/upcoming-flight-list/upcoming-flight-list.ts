import { LegProvider } from './../../providers/leg/leg';
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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private rotationProvider: RotationProvider,
    private legProvider: LegProvider) {
  }

  ionViewDidLoad() {
    this.upcomingRotations = this.rotationProvider.getUpcomingRotations();
  }

  /**
   * Ouvre/ferme une rotation et récupère la liste des tronçons si elle est ouverte
   * @param rotation La rotation à ouvrir/fermer
   */
  toggleRotation(rotation: Rotation) {
    rotation.opened = !rotation.opened;
    if (rotation.opened) {
      rotation.loading = true;
      rotation.legs = this.legProvider.getRotationLegs(rotation);
      rotation.loading = false;
    }
  }

}
