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
    private rotationProvider: RotationProvider) {
  }

  ionViewDidLoad() {
    this.upcomingRotations = this.rotationProvider.getUpcomingRotations();
  }

}
