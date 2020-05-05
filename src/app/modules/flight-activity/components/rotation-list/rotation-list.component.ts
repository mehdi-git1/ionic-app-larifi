import * as moment from 'moment';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AppConstant } from '../../../../app.constant';
import { RotationModel } from '../../../../core/models/rotation.model';

@Component({
    selector: 'rotation-list',
    templateUrl: 'rotation-list.component.html',
    styleUrls: ['./rotation-list.component.scss']
})
export class RotationListComponent implements OnInit {

    @Input() rotationList: RotationModel[];

    @Output() activeRotationChange = new EventEmitter();
    activeRotation: RotationModel;

    upcomingRotations: RotationModel[];
    lastPerformedRotations: RotationModel[];
    inProgressRotation: RotationModel;

    // Le nombre d'heure de marge qu'on se donne pour considérer la rotation démarrée/terminée
    ROTATION_START_END_HOURS_THRESHOLD = 5;
    // Nombre de rotation passée max à afficher
    LAST_PERFORMED_ROTATION_COUNT = 3;

    ngOnInit() {
        this.rotationList = this.sortByDescendingDepartureDate();

        this.lastPerformedRotations = this.getLastPerformedRotations();
        this.upcomingRotations = this.getUpcomingRotations();
        this.inProgressRotation = this.getInProgressRotation();

        this.activeRotation = this.getActiveRotation();
        this.selectRotation(this.activeRotation);
    }

    /**
     * Retourne les deux dernières rotations passées
     * @return les deux dernières rotations passées
     */
    getLastPerformedRotations(): Array<RotationModel> {
        return this.rotationList.filter(rotation => {
            return moment(rotation.departureDate).isBefore(moment());
        }).slice(-this.LAST_PERFORMED_ROTATION_COUNT);
    }

    /**
     * Retourne les rotations à venir
     * @return les rotations à venir
     */
    getUpcomingRotations(): Array<RotationModel> {
        return this.rotationList.filter(rotation => {
            return moment(rotation.departureDate).isAfter(moment());
        });
    }

    /**
     * Récupère la rotation en cours, s'il y en a une
     * @return la rotation en cours
     */
    getInProgressRotation(): RotationModel {
        let inProgressRotation = null;
        const now = moment().utc();

        // Pour récupérer la rotation en cours, on vérifie les rotations passées et à venir les plus proches de la date actuelle
        if (this.lastPerformedRotations.length > 0) {
            const rotation = this.lastPerformedRotations[0];
            // On considère la rotation "en cours" si celle ci n'est pas encore terminée.
            // Pour cela, on se base sur la date d'arrivée du dernier tronçon et on prend une marge de 5 heures.
            if (rotation.legs && rotation.legs.length > 0) {
                const lastLeg = rotation.legs[rotation.legs.length - 1];
                if (lastLeg.arrivalDate && moment(lastLeg.arrivalDate).add(this.ROTATION_START_END_HOURS_THRESHOLD, 'hours').isAfter(now)) {
                    inProgressRotation = this.lastPerformedRotations.shift();
                }
            }
        }
        if (inProgressRotation === null && this.upcomingRotations.length > 0) {
            const rotation = this.upcomingRotations[this.upcomingRotations.length - 1];
            // On considère la rotation "en cours" si celle ci s'apprête à démarrer
            // Pour cela, on se base sur la date de début de la rotation on prend une marge de 5 heures.
            if (rotation.legs && rotation.legs.length > 0) {
                if (moment(rotation.departureDate).subtract(this.ROTATION_START_END_HOURS_THRESHOLD, 'hours').isBefore(now)) {
                    inProgressRotation = this.upcomingRotations.pop();
                }
            }
        }

        return inProgressRotation;
    }

    /**
     * Récupère la rotation active.
     * Celle en cours si elle existe, sinon la prochaine à venir si elle existe, sinon la première de la liste
     * @return la rotation à activer par défaut
     */
    getActiveRotation(): RotationModel {
        if (this.inProgressRotation !== null) {
            return this.inProgressRotation;
        }
        if (this.upcomingRotations.length > 0) {
            return this.upcomingRotations[this.upcomingRotations.length - 1];
        }
        return this.lastPerformedRotations[0];
    }

    /**
     * Tri les rotations par date descendante et les tronçons par date de départ ascendante     
     * @return la liste des rotations triée
     */
    sortByDescendingDepartureDate() {
        this.rotationList.forEach(rotation => {
            rotation.legs.sort((leg1, leg2) => {
                return moment(leg1.departureDate, AppConstant.isoDateFormat)
                    .isBefore(moment(leg2.departureDate, AppConstant.isoDateFormat)) ? -1 : 1;
            });
        });

        return this.rotationList.sort((rotation1, rotation2) => {
            return moment(rotation1.departureDate, AppConstant.isoDateFormat)
                .isAfter(moment(rotation2.departureDate, AppConstant.isoDateFormat)) ? -1 : 1;
        });
    }

    /**
     * Vérifie s'il existe des rotations à venir
     * @return true si c'est le cas, false sinon
     */
    hasUpcomingRotations(): boolean {
        return this.upcomingRotations && this.upcomingRotations.length > 0;
    }

    /**
     * Vérifie s'il existe des rotations passées
     * @return true si c'est le cas, false sinon
     */
    hasLastPerformedRotations(): boolean {
        return this.lastPerformedRotations && this.lastPerformedRotations.length > 0;
    }

    /**
     * Vérifie s'il existe une rotation en cours
     * @return true si c'est le cas, false sinon
     */
    hasInProgressRotation(): boolean {
        return this.inProgressRotation !== null;
    }

    /**
     * Vérifie si la rotation passée en paramètre est celle active
     * @param rotation la rotation à tester
     * @return vrai si la rotation est celle actuellement active, faux sinon
     */
    isActive(rotation: RotationModel): boolean {
        return this.activeRotation === rotation;
    }

    /**
     * "Active" la rotation passée en paramètre
     * @param rotation la rotation à activer
     */
    selectRotation(rotation: RotationModel) {
        this.activeRotation = rotation;
        this.activeRotationChange.emit(this.activeRotation);
    }
}

