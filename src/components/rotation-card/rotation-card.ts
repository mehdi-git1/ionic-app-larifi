import { SessionService } from './../../services/session.service';
import { Leg } from './../../models/leg';
import { FlightCrewListPage } from './../../pages/flight-crew-list/flight-crew-list';
import { NavParams, NavController } from 'ionic-angular';
import { RotationProvider } from './../../providers/rotation/rotation';
import { Rotation } from './../../models/rotation';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'rotation-card',
  templateUrl: 'rotation-card.html'
})
export class RotationCardComponent {

  @Input() rotation: Rotation;

  constructor(private rotationProvider: RotationProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private sessionService: SessionService) {
  }

  /**
  * Ouvre/ferme une rotation et récupère la liste des tronçons si elle est ouverte
  * @param rotation La rotation à ouvrir/fermer
  */
  toggleRotation(rotation: Rotation) {
    rotation.opened = !rotation.opened;
    if (rotation.opened) {
      rotation.loading = true;
      this.rotationProvider.getRotationLegs(rotation).then(rotationLegs => {
        rotation.legs = rotationLegs;
        rotation.loading = false;
      }, error => {
        rotation.loading = false;
      });
    }
  }

  goToFlightCrewListPage(leg: Leg) {
    this.sessionService.appContext.rotationId = this.rotation.techId;
    this.navCtrl.push(FlightCrewListPage, { leg: leg });
  }
}
