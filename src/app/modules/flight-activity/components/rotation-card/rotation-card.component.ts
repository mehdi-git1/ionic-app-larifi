import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { LegModel } from '../../../../core/models/leg.model';
import { FlightCrewListPage } from '../../pages/flight-crew-list/flight-crew-list.page';
import { NavParams, NavController } from 'ionic-angular';
import { RotationService } from '../../../../core/services/rotation/rotation.service';
import { RotationModel } from '../../../../core/models/rotation.model';
import { Component, Input } from '@angular/core';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';

@Component({
    selector: 'rotation-card',
    templateUrl: 'rotation-card.component.html'
})
export class RotationCardComponent {

    @Input() rotation: RotationModel;

    constructor(private rotationProvider: RotationService,
        public navCtrl: NavController,
        public navParams: NavParams,
        public connectivityService: ConnectivityService,
        private toastProvider: ToastService,
        private translate: TranslateService,
        private sessionService: SessionService) {
    }

    /**
    * Ouvre/ferme une rotation et récupère la liste des tronçons si elle est ouverte
    * @param rotation La rotation à ouvrir/fermer
    */
    toggleRotation(rotation: RotationModel) {
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

    goToFlightCrewListPage(leg: LegModel) {
        this.sessionService.appContext.lastConsultedRotation = this.rotation;
        this.navCtrl.push(FlightCrewListPage, { legId: leg.techId });
    }

    displayErrorMessage() {
        this.toastProvider.error(this.translate.instant('SYNCHRONIZATION.ROTATION_SAVED_OFFLINE_ERROR', { 'rotationNumber': this.rotation.number }));
    }
}

