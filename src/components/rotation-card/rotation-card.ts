import { TranslateService } from '@ngx-translate/core';
import { ToastProvider } from './../../providers/toast/toast';
import { SessionService } from './../../services/session.service';
import { Leg } from './../../models/leg';
import { FlightCrewListPage } from './../../pages/flight-crew-list/flight-crew-list';
import { NavParams, NavController } from 'ionic-angular';
import { RotationProvider } from './../../providers/rotation/rotation';
import { Rotation } from './../../models/rotation';
import { Component, Input } from '@angular/core';
import { ConnectivityService } from '../../services/connectivity/connectivity.service';

@Component({
    selector: 'rotation-card',
    templateUrl: 'rotation-card.html'
})
export class RotationCardComponent {

    @Input() rotation: Rotation;

    constructor(private rotationProvider: RotationProvider,
        public navCtrl: NavController,
        public navParams: NavParams,
        public connectivityService: ConnectivityService,
        private toastProvider: ToastProvider,
        private translate: TranslateService,
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
        this.sessionService.appContext.lastConsultedRotation = this.rotation;
        this.navCtrl.push(FlightCrewListPage, { legId: leg.techId });
    }

    displayErrorMessage() {
        this.toastProvider.error(this.translate.instant('SYNCHRONIZATION.ROTATION_SAVED_OFFLINE_ERROR', { 'rotationNumber': this.rotation.number }));
    }
}

