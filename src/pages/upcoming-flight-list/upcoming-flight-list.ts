import { SessionService } from './../../services/session.service';
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
    private sessionService: SessionService,
    private pncProvider: PncProvider,
    private rotationProvider: RotationProvider) {
  }

  ionViewDidLoad() {
    this.pncProvider.getLastPerformedRotation(this.sessionService.authenticatedUser.username).then(lastPerformedRotation => {
      this.lastPerformedRotation = lastPerformedRotation;
    }, error => { });

    this.pncProvider.getUpcomingRotations(this.sessionService.authenticatedUser.username).then(upcomingRotations => {
      this.upcomingRotations = upcomingRotations;
    }, error => { });
  }

}
