import { RotationModel } from 'src/app/core/models/rotation.model';

import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { EFormsTypeEnum } from '../../../../core/enums/e-forms/e-forms-type.enum';
import {
    EObservationDisplayModeEnum
} from '../../../../core/enums/eobservation/eobservation-display-mode.enum';
import { SpecialityEnum } from '../../../../core/enums/speciality.enum';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { FormsInputParamsModel } from '../../../../core/models/forms-input-params.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { DeviceService } from '../../../../core/services/device/device.service';
import {
    FormsEObservationService
} from '../../../../core/services/forms/forms-e-observation.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';

@Component({
    selector: 'eobservation-list',
    templateUrl: 'eobservation-list.component.html',
    styleUrls: ['eobservation-list.component.scss']
})

export class EObservationListComponent {

    @Input() eObservations: EObservationModel[];

    canDisplayMenu = false;

    lastConsultedRotation: RotationModel;

    formsInputParam: FormsInputParamsModel;

    @Input() eObservationDisplayMode: EObservationDisplayModeEnum;
    EObservationDisplayModeEnum = EObservationDisplayModeEnum;
    // Liste des eForms possible
    eFormsList = [];

    chosenEFormsType = null;

    @Input() pnc: PncModel;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private sessionService: SessionService,
        private deviceService: DeviceService,
        private formsEObservationService: FormsEObservationService,
        private pncService: PncService) {
        this.lastConsultedRotation = this.sessionService.appContext.lastConsultedRotation;
    }

    /**
     * Détermine si on peut créer une nouvelle eObservation
     * @return vrai si c'est le cas, faux sinon
     */
    canCreateEObservation(): boolean {
        if (this.sessionService.appContext.lastConsultedRotation && !this.deviceService.isBrowser()) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Redirige vers le détail d'une eObservation
     * @param eObservationId l'id de l'observation vers laquelle on souhaite naviguer
     */
    goToEObservationDetail(eObservationId) {
        this.router.navigate(['../eobservation', 'detail', eObservationId], { relativeTo: this.activatedRoute });
    }

    /**
     * Redirige vers la page des archives des eObservations
     */
    goToEobservationsArchives() {
        this.router.navigate(['../eobservation', 'archive'], { relativeTo: this.activatedRoute });
    }

    /**
     * Retourne le texte du type de formulaire pour la création d'EObs
     * @return retourne la valeur du type de formulaire
     */
    getEObsTextTypeEForm(): string {
        return EFormsTypeEnum.getTextType(SpecialityEnum[this.pnc.currentSpeciality]);
    }

    /**
     * Vérifie si le type de formulaire est géré
     * @return true si il est géré, sinon false
     */
    hasEObsTypeForm(): boolean {
        return this.getEObsTextTypeEForm() !== undefined;
    }

    /**
     * Affichage du menu de la liste des eForms
     */
    displayEObservationTypeSelection() {
        const typeOfEForms = this.getEObsTextTypeEForm();
        if (typeOfEForms && typeOfEForms.indexOf('/') === -1) {
            this.chosenEFormsType = EFormsTypeEnum.getType(EFormsTypeEnum[typeOfEForms.trim()]);
            this.createEObservation();
        } else {
            if (typeOfEForms) {
                this.eFormsList = typeOfEForms.split('/');
            }
            this.canDisplayMenu = true;
        }
    }

    /**
     * Fait appel à formsLib avec les paramètres eObservation.
     */
    createEObservation() {
        this.formsInputParam = this.formsEObservationService.getFormsInputParams();
        if (this.formsInputParam) {
            this.formsEObservationService.callForms(this.formsInputParam, this.chosenEFormsType);
        }
        this.chosenEFormsType = null;
    }

    /**
     * Appelle le formulaire choisi
     * @param value Valeur du type de formulaire choisie
     */
    getEFormsTypeBeforeCreate(value: string) {
        this.chosenEFormsType = EFormsTypeEnum.getType(EFormsTypeEnum[value.trim()]);
        this.canDisplayMenu = false;
        this.createEObservation();
    }

    /**
     * Renvoie la spécialité du pnc à afficher
     * @param pnc le pnc concerné
     * @return la fonction du pnc à afficher
     */
    getFormatedSpeciality(pnc: PncModel): string {
        return this.pncService.getFormatedSpeciality(pnc);
    }

}
