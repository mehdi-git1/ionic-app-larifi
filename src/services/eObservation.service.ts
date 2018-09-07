import { eFormsReportType } from './../models/eFormsReportType';
import { EObservationProvider } from './../providers/e-observation/e-observation';
import { Rotation } from './../models/rotation';
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
  eObs: EObservation;

  constructor(
    private pncProvider: PncProvider,
    private eObservationProvider: EObservationProvider,
    public sessionService: SessionService,
    public restService: RestService,
    public config: Config,
    private datePipe: DatePipe
  ) {
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

  getEObservation(observedPncMatricule, rotationId: number): Promise<EObservation> {
    return this.eObservationProvider.getEObservation(observedPncMatricule, rotationId);
  }

  /**
   * Appel de l'application eForms avec les bons parametres
   */
  callForms(eObservation: EObservation) {
    const param = {
      eformsAppId: `${this.config.eObsUrl}`,
      method: '0',
      reportType: this.getReportTypeForEForms(eObservation.observedPnc.speciality),
      callbackUrl: `${this.config.eObsCallbackUrl}`,
      callbackActionLabel: `${this.config.eObsCallbackActionLabel}`,
      archiveData: {
        'PNCObserve.fonction': this.getSpecialityForEForms(eObservation.observedPnc.speciality),
        'PNCObserve.matricule': eObservation.observedPnc.matricule,
        'PNCObserve.nom': eObservation.observedPnc.lastName,
        'PNCObserve.prenom': eObservation.observedPnc.firstName,
        'date.vol1': this.datePipe.transform(eObservation.rotationFirstLeg.departureDate, 'dd/MM/yyyy'),
        'date.vol2': this.datePipe.transform(eObservation.rotationLastLeg.departureDate, 'dd/MM/yyyy'),
        'escaleArrivee.vol1': eObservation.rotationFirstLeg.arrivalStation,
        'escaleArrivee.vol2': eObservation.rotationLastLeg.arrivalStation,
        'escaleDepart.vol1': eObservation.rotationFirstLeg.departureStation,
        'escaleDepart.vol2': eObservation.rotationLastLeg.departureStation,
        'flightNumber.vol1': eObservation.rotationFirstLeg.company + eObservation.rotationFirstLeg.number,
        'flightNumber.vol2': eObservation.rotationLastLeg.company + eObservation.rotationLastLeg.number,
        'flightinfos.pairing.date': this.datePipe.transform(eObservation.rotation.departureDate, 'dd/MM/yyyy'),
        'flightinfos.pairing.name': eObservation.rotation.number,
        'remplissage.vol1': '',
        'remplissage.vol2': '',
        'stakeholdersinfos.2.1': eObservation.redactor.lastName,
        'stakeholdersinfos.2.2': eObservation.redactor.firstName,
        'stakeholdersinfos.2.3': eObservation.redactor.matricule,
        'stakeholdersinfos.2.4': this.getSpecialityForEForms(this.sessionService.appContext.onBoardRedactorFunction),
        'typeAvion.vol1': eObservation.rotationFirstLeg.aircraftType,
        'typeAvion.vol2': eObservation.rotationLastLeg.aircraftType,
        'version.vol1': eObservation.rotationFirstLeg.operatingVersion,
        'version.vol2': eObservation.rotationLastLeg.operatingVersion
      }
    };

    this.formsPlugin.callUrlAppScheme(
      success => {
        console.log('Success: callUrlAppScheme');
        console.log(success);
      },
      error => console.log(error),
      param
    );
  }

  getSpecialityForEForms(speciality: String) {
    if (speciality == 'CC') { return 'C/C'; }
    if (speciality == 'HOT' || speciality == 'STW') { return 'HST'; }
    return speciality;
  }

  getReportTypeForEForms(speciality: String) {
    if (speciality == 'HOT' || speciality == 'STW') { return eFormsReportType.HST; }
    if (speciality == 'CC') { return eFormsReportType.CC; }
    return eFormsReportType.CCP;
  }
}
