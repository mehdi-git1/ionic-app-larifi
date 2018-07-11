import { Leg } from './../../models/leg';
import { FlightCrewListPage } from './../../pages/flight-crew-list/flight-crew-list';
import { NavParams, NavController } from 'ionic-angular';
import { RotationProvider } from './../../providers/rotation/rotation';
import { Rotation } from './../../models/rotation';
import { Component, Input } from '@angular/core';
import { SynchronizationProvider } from './../../providers/synchronization/synchronization';
import { ToastProvider } from './../../providers/toast/toast';
import { ConnectivityService } from '../../services/connectivity.service';
import { TranslateService } from '@ngx-translate/core';
import { LegProvider } from './../../providers/leg/leg';

@Component({
  selector: 'rotation-card',
  templateUrl: 'rotation-card.html'
})
export class RotationCardComponent {

  @Input() rotation: Rotation;

  constructor(private rotationProvider: RotationProvider,
    public navCtrl: NavController) {
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
    this.navCtrl.push(FlightCrewListPage, { leg: leg });
  }

}
