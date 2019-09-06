import { NavController, NavParams } from 'ionic-angular';

import { Component, Input, OnInit } from '@angular/core';

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
import {
    EObservationsArchivesPage
} from '../../../eobservation/pages/eobservations-archives/eobservations-archives.page';

@Component({
    selector: 'eobservation-list',
    templateUrl: 'eobservation-list.component.html'
})

export class EObservationListComponent implements OnInit {

    matricule: string;
    @Input() eObservations: EObservationModel[];

    canDisplayMenu = false;

    formsInputParam: FormsInputParamsModel;

    EObservationDisplayModeEnum = EObservationDisplayModeEnum;

    // Liste des eForms possible
    eFormsList = [];

    chosenEFormsType = null;

    pnc: PncModel;

    constructor(
        private navParams: NavParams,
        private navCtrl: NavController,
        private sessionService: SessionService,
        private deviceService: DeviceService,
        private formsEObservationService: FormsEObservationService,
        private pncService: PncService) { }

    ngOnInit() {
        this.matricule = this.navParams.get('matricule');
        this.pncService.getPnc(this.matricule).then(pnc => {
            this.pnc = pnc;
        }, error => {
        });
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
     * Redirige vers la page des archives des eObservations
     */
    goToEobservationsArchives() {
        this.navCtrl.push(EObservationsArchivesPage, { matricule: this.matricule });
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
        return this.getEObsTextTypeEForm() != undefined;
    }

    /**
     * Affichage du menu de la liste des eForms
     */
    displayEObservationTypeSelection() {
        const typeOfEForms = this.getEObsTextTypeEForm();
        if (typeOfEForms.indexOf('/') == -1) {
            this.chosenEFormsType = EFormsTypeEnum.getType(EFormsTypeEnum[typeOfEForms.trim()]);
            this.createEObservation();
        } else {
            this.eFormsList = typeOfEForms.split('/');
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

}
