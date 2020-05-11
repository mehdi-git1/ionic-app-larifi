import * as moment from 'moment';

import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TabHeaderEnum } from '../../../../core/enums/tab-header.enum';
import { LegModel } from '../../../../core/models/leg.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { RotationModel } from '../../../../core/models/rotation.model';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';

@Component({
    selector: 'page-upcoming-flight-list',
    templateUrl: 'upcoming-flight-list.page.html',
    styleUrls: ['./upcoming-flight-list.page.scss'],
    animations: [
        trigger(
            'selectRotationAnimation',
            [
                transition(
                    ':enter',
                    [
                        style({ marginTop: -100, opacity: 0 }),
                        animate('300ms ease-out',
                            style({ marginTop: 0, opacity: 1 }))
                    ]
                ),
                transition(
                    ':leave',
                    [
                        style({ marginTop: 0, opacity: 1 }),
                        animate('300ms ease-in',
                            style({ marginTop: 100, opacity: 0 }))
                    ]
                )
            ]
        )
    ]
})
export class UpcomingFlightListPage {
    matricule: string;

    pnc: PncModel;

    rotationList: RotationModel[];

    activeRotation: RotationModel;

    TabHeaderEnum = TabHeaderEnum;

    isMenuOpened = false;
    isDeleteAnimationOver = true;

    // Le nombre de minutes de marge qu'on se donne pour considérer le vol démarré/terminé
    FLIGHT_START_END_MINUTES_THRESHOLD = 30;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private pncService: PncService,
        private sessionService: SessionService) {
    }

    ionViewDidEnter() {
        this.initPage();
    }

    /**
     * Initialisation du contenu de la page.
     */
    initPage() {
        this.matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
        this.pncService.getPnc(this.matricule).then(pnc => {
            this.pnc = pnc;
        }, error => { });

        this.rotationList = undefined;

        this.pncService.getAllRotations(this.matricule).then(rotationList => {
            // Tri des rotations par date ascendante
            this.rotationList = rotationList;
            this.isMenuOpened = true;
        }, error => { });
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.rotationList !== undefined;
    }

    /**
     * Met à jour la rotation active
     * @param rotation la rotation à rendre active
     */
    updateActiveRotation(rotation: RotationModel) {
        if (this.activeRotation !== rotation) {
            this.isDeleteAnimationOver = false;
            setTimeout(() => {
                this.isDeleteAnimationOver = true;
                this.activeRotation = rotation;
            }, 300);
        }
    }

    /**
     * Redirige vers la liste équipage du vol
     * @param leg le vol dont on souhaite consulter la liste équipage
     */
    goToFlightCrewListPage(leg: LegModel) {
        this.sessionService.appContext.lastConsultedRotation = this.activeRotation;
        this.router.navigate(['crew-list'],
            {
                relativeTo: this.activatedRoute,
                state: {
                    data: { leg: leg }
                }
            });
    }

    /**
     * Vérifie si un vol est en cours
     * @param flight le vol à tester
     * @return vrai si c'est le cas, faux sinon
     */
    isFlightActive(flight: LegModel): boolean {
        const now = moment().utc();

        if (flight && flight.departureDate && flight.arrivalDate) {
            return now.isBetween(
                moment(flight.departureDate).subtract(this.FLIGHT_START_END_MINUTES_THRESHOLD, 'minutes'),
                moment(flight.arrivalDate).add(this.FLIGHT_START_END_MINUTES_THRESHOLD, 'minutes'));
        }
        return false;
    }

}
