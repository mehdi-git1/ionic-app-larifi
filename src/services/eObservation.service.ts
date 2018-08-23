import { Config } from './../configuration/environment-variables/config';
import { EObservation } from './../models/eObservation';
import { SessionService } from './session.service';
import { PncProvider } from './../providers/pnc/pnc';
import { DatePipe } from '@angular/common';

import { Injectable } from '@angular/core';
import { RestService } from './rest.base.service';

declare var window: any;

@Injectable()
export class EObservationService {
  private eObsUrl: string;
  eObs: EObservation;

  constructor(
    private pncProvider: PncProvider,
    public sessionService: SessionService,
    public restService: RestService,
    public config: Config,
    private datePipe: DatePipe
  ) {
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
    console.log('Before: getEObservation:' + `${this.eObsUrl}/${observedPncMatricule}/${rotationId}`);
    return this.restService.get(`${this.eObsUrl}/${observedPncMatricule}/${rotationId}`);
  }

  callForms(eObservation: EObservation) {
    const param = {
      eformsAppId: `${this.config.eObsUrl}`,
      method: '0',
      callbackUrl: `${this.config.eObsCallbackUrl}`,
      callbackActionLabel: `${this.config.eObsCallbackActionLabel}`,
      archiveData: {
        // A DECOMMENTER POUR AVOIR LES DONNEES DU FORMULAIRE
        'PNCObserve.fonction': eObservation.observedPnc.speciality,
        'PNCObserve.matricule': eObservation.observedPnc.matricule,
        'PNCObserve.nom': eObservation.observedPnc.lastName,
        'PNCObserve.prenom': eObservation.observedPnc.firstName,
        'date.vol1': this.datePipe.transform(eObservation.rotationFirstLeg.departureDate, 'dd/MM/yyyy'),
        'date.vol2': this.datePipe.transform(eObservation.rotationLastLeg.departureDate, 'dd/MM/yyyy'),
        'escaleArrivee.vol1': eObservation.rotationFirstLeg.arrivalStation,
        'escaleArrivee.vol2': eObservation.rotationLastLeg.arrivalStation,
        'escaleDepart.vol1': eObservation.rotationFirstLeg.departureStation,
        'escaleDepart.vol2': eObservation.rotationLastLeg.departureStation,
        'flightNumber.vol1': eObservation.rotationFirstLeg.number,
        'flightNumber.vol2': eObservation.rotationLastLeg.number,
        'flightinfos.pairing.date': this.datePipe.transform(eObservation.rotation.departureDate, 'dd/MM/yyyy'),
        'flightinfos.pairing.name': eObservation.rotation.number,
        'remplissage.vol1': '',
        'remplissage.vol2': '',
        'stakeholdersinfos.2.1': eObservation.redactor.lastName,
        'stakeholdersinfos.2.2': eObservation.redactor.firstName,
        'stakeholdersinfos.2.3': eObservation.redactor.matricule,
        'stakeholdersinfos.2.4': this.sessionService.appContext.onBoardRedactorFonction,
        'typeAvion.vol1': eObservation.rotationFirstLeg.aircraftType,
        'typeAvion.vol2': eObservation.rotationLastLeg.aircraftType,
        'version.vol1': eObservation.rotationFirstLeg.operatingVersion,
        'version.vol2': eObservation.rotationLastLeg.operatingVersion

        // DONNEES DE TEST
        // 'PNCObserve.fonction': 'HST'
        // 'PNCObserve.matricule': '09094564',
        // 'PNCObserve.nom': 'VUITTON',
        // 'PNCObserve.prenom': 'LOUIS',
        // 'date.vol1': '04/05/2018',
        // 'date.vol2': '06/05/2018',
        // 'escaleArrivee.vol1': 'JFK',
        // 'escaleArrivee.vol2': 'CDG',
        // 'escaleDepart.vol1': 'CDG',
        // 'escaleDepart.vol2': 'JFK',
        // 'flightNumber.vol1': 'AF006',
        // 'flightNumber.vol2': 'AF009',
        // 'flightinfos.pairing.date': '04/05/2018',
        // 'flightinfos.pairing.name': 'FUR20006',
        // 'remplissage.vol1': '464 - 4P70J33W357Y',
        // 'remplissage.vol2': '283 - 4P51J24W204Y',
        // 'stakeholdersinfos.2.1': 'HERMES',
        // 'stakeholdersinfos.2.2': 'THIERRY',
        // 'stakeholdersinfos.2.3': '15944372',
        // 'stakeholdersinfos.2.4': 'CCP',
        // 'typeAvion.vol1': '388',
        // 'typeAvion.vol2': '77W',
        // 'version.vol1': 'P009J080W038Y389',
        // 'version.vol2': 'P004J058W028Y206'
      }
    };
    console.log(JSON.stringify(param));
    this.formsPlugin.callUrlAppScheme(
      success => {
        console.log('Success: callUrlAppScheme');
        console.log(success);
      },
      error => console.log(error),
      param
    );
  }
}
