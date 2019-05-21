import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { LegModel } from '../../../../core/models/leg.model';
import { FlightCrewListPage } from '../../pages/flight-crew-list/flight-crew-list.page';
import { NavController } from 'ionic-angular';
import { RotationModel } from '../../../../core/models/rotation.model';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'rotation-card',
    templateUrl: 'rotation-card.component.html'
})
export class RotationCardComponent {

    @Input() rotation: RotationModel;

    constructor(private navCtrl: NavController,
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
    }

    goToFlightCrewListPage(leg: LegModel) {
        this.sessionService.appContext.lastConsultedRotation = this.rotation;
        this.navCtrl.push(FlightCrewListPage, { leg: leg });
    }

    displayErrorMessage() {
        this.toastProvider.error(this.translate.instant('SYNCHRONIZATION.ROTATION_SAVED_OFFLINE_ERROR', { 'rotationNumber': this.rotation.number }));
    }
}

