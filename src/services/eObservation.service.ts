import { Config } from './../configuration/environment-variables/config';
import { EObservation } from './../models/eObservation';
import { RotationProvider } from './../providers/rotation/rotation';
import { SessionService } from './session.service';
import { SecurityProvider } from './../providers/security/security';
import { PncProvider } from './../providers/pnc/pnc';
import { NavController, NavParams } from 'ionic-angular';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RestService } from './rest.base.service';

declare var window: any;

@Injectable()
export class EObservationService {

    private eObsUrl: string;
    eObs: EObservation;

    constructor(private pncProvider: PncProvider,
        public sessionService: SessionService,
        public restService: RestService,
        public config: Config) {
        this.eObsUrl = `${config.backEndUrl}/eobservation`;
    }


    get formsPlugin(): any {
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.FormsLibPlugin) {
            return window.cordova.plugins.FormsLibPlugin;
        } else {
            if (window.cordova.plugins) {
                console.log(window.cordova.FormsLibPlugin);
            }
            console.log('Plugin not loaded we\'re in browser mode in get');
            return null;
        }
    }

    getEObservation(observedPncMatricule, rotationId): Promise<EObservation> {
        return this.restService.get(`${this.eObsUrl}/${observedPncMatricule}/${rotationId}`);
    }

    callForms(eObservation: EObservation) {

        const param = {
            eformsAppId: `${this.config.eObsUrl}`,
            method: '0',
            callbackUrl: `${this.config.eObsCallbackUrl}`,
            callbackActionLabel: `${this.config.eObsCallbackActionLabel}`,
            archiveData: {
                'PNCObserve.fonction': eObservation.eObsType,
                'PNCObserve.matricule': eObservation.observedPnc.matricule,
                'PNCObserve.nom': eObservation.observedPnc.lastName,
                'PNCObserve.prenom': eObservation.observedPnc.firstName,
                'date.vol1': eObservation.firtRotationLeg.departureDate,
                'date.vol2': eObservation.lastRotationLeg.departureDate,
                'escaleArrivee.vol1': eObservation.firtRotationLeg.arrivalStation,
                'escaleArrivee.vol2': eObservation.lastRotationLeg.arrivalStation,
                'escaleDepart.vol1': eObservation.firtRotationLeg.departureStation,
                'escaleDepart.vol2': eObservation.lastRotationLeg.departureStation,
                'flightNumber.vol1': eObservation.firtRotationLeg.number,
                'flightNumber.vol2': eObservation.lastRotationLeg.number,
                'flightinfos.pairing.date': eObservation.rotation.departureDate,
                'flightinfos.pairing.name': eObservation.rotation.number,
                'remplissage.vol1': '464 - 4P70J33W357Y',
                'remplissage.vol2': '283 - 4P51J24W204Y',
                'stakeholdersinfos.2.1': eObservation.redactor.lastName,
                'stakeholdersinfos.2.2': eObservation.redactor.firstName,
                'stakeholdersinfos.2.3': eObservation.redactor.matricule,
                'stakeholdersinfos.2.4': eObservation.redactor.speciality,
                'typeAvion.vol1': eObservation.firtRotationLeg.aircraftType,
                'typeAvion.vol2': eObservation.lastRotationLeg.aircraftType,
                'version.vol1': 'P009J080W038Y389',
                'version.vol2': 'P004J058W028Y206'
            }
        };
        this.formsPlugin.callUrlAppScheme((success) => {
            console.log('Success: callUrlAppScheme');
            console.log(success);
        }, (error) => console.log(error), param);

    }




}
