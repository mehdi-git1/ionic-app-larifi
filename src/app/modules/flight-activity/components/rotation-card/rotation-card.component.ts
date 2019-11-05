import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { LegModel } from '../../../../core/models/leg.model';
import { RotationModel } from '../../../../core/models/rotation.model';
import { SessionService } from '../../../../core/services/session/session.service';
import { ToastService } from '../../../../core/services/toast/toast.service';

@Component({
    selector: 'rotation-card',
    templateUrl: 'rotation-card.component.html',
    styleUrls: ['./rotation-card.component.scss']
})
export class RotationCardComponent {

    @Input() rotation: RotationModel;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private toastService: ToastService,
        private translateService: TranslateService,
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
        this.router.navigate(['crew-list'],
            {
                relativeTo: this.activatedRoute,
                state: {
                    data: { leg: leg }
                }
            });
    }

    displayErrorMessage() {
        this.toastService.error(
            this.translateService.instant('SYNCHRONIZATION.ROTATION_SAVED_OFFLINE_ERROR', { rotationNumber: this.rotation.number }));
    }
}

