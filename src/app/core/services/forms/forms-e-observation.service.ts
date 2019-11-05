import * as moment from 'moment';

import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

import { Config } from '../../../../environments/config';
import { AppConstant } from '../../../app.constant';
import { RestService } from '../../http/rest/rest.base.service';
import { FormsInputParamsModel } from '../../models/forms-input-params.model';
import { LegModel } from '../../models/leg.model';
import { PncModel } from '../../models/pnc.model';
import { SessionService } from '../session/session.service';

declare var window: any;

@Injectable({ providedIn: 'root' })
export class FormsEObservationService {

  dateFormat = 'dd/MM/yyyy';

  constructor(
    public sessionService: SessionService,
    public restService: RestService,
    public config: Config,
    private datePipe: DatePipe
  ) {
  }

  /**
   * Charge le plugin FormsLib si il est chargeable
   */
  get formsPlugin(): any {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.FormsLibPlugin) {
      return window.cordova.plugins.FormsLibPlugin;
    } else {
      if (window.cordova && window.cordova.plugins) {
        console.log(window.cordova.FormsLibPlugin);
      }
      console.log('Plugin not loaded we\'re in browser mode in get');
      return null;
    }
  }

  /**
   * Récupère les paramètres d'entrée nécessaires à l'ouverture d'un formulaire d'eObs prérempli
   * @return un objet contenant les paramètres d'entrée nécessaires à l'appel d'Eforms
   */
  getFormsInputParams(): FormsInputParamsModel {
    const formsInputParams = new FormsInputParamsModel();

    formsInputParams.observedPnc = this.sessionService.appContext.observedPnc;
    formsInputParams.redactor = new PncModel();
    formsInputParams.redactor.matricule = this.sessionService.getActiveUser().matricule;
    formsInputParams.redactor.lastName = this.sessionService.getActiveUser().lastName;
    formsInputParams.redactor.firstName = this.sessionService.getActiveUser().firstName;

    formsInputParams.rotation = this.sessionService.appContext.lastConsultedRotation;

    const rotationLegs = this.sortLegsByDepartureDate(this.sessionService.appContext.lastConsultedRotation.legs);

    formsInputParams.rotationFirstLeg = rotationLegs[0] === undefined ? undefined : rotationLegs[0];
    formsInputParams.rotationLastLeg = rotationLegs[rotationLegs.length - 1] === undefined ? undefined : rotationLegs[rotationLegs.length - 1];

    return formsInputParams;
  }

  /**
   * Trie la liste des vols par date de départ
   * @param flights liste de vols
   * @return liste de vols triés
   */
  sortLegsByDepartureDate(flights: LegModel[]): LegModel[] {
    return flights.sort((leg1, leg2) => moment(leg1.departureDate, AppConstant.isoDateFormat).isBefore(moment(leg2.departureDate, AppConstant.isoDateFormat)) ? 1 : -1);
  }

  /**
   * Appel de l'application Forms avec les bons paramètres
   * @param formsInputParams Paramétres du formulaire à envoyer
   */
  callForms(formsInputParams: FormsInputParamsModel, chosenEFormsType: string) {
    const param = {
      eformsAppId: `${this.config.eformsUrl}`,
      method: '0',
      reportType: chosenEFormsType,
      callbackUrl: `${this.config.eformsCallbackUrl}`,
      callbackActionLabel: `${this.config.eformsCallbackActionLabel}`,
      archiveData: {
        'PNCObserve.fonction': this.getSpecialityForEForms(formsInputParams.observedPnc.speciality),
        'PNCObserve.matricule': formsInputParams.observedPnc.matricule,
        'PNCObserve.nom': formsInputParams.observedPnc.lastName,
        'PNCObserve.prenom': formsInputParams.observedPnc.firstName,
        'date.vol1': this.datePipe.transform(formsInputParams.rotationFirstLeg.departureDate, this.dateFormat),
        'date.vol2': this.datePipe.transform(formsInputParams.rotationLastLeg.departureDate, this.dateFormat),
        'escaleArrivee.vol1': formsInputParams.rotationFirstLeg.arrivalStation,
        'escaleArrivee.vol2': formsInputParams.rotationLastLeg.arrivalStation,
        'escaleDepart.vol1': formsInputParams.rotationFirstLeg.departureStation,
        'escaleDepart.vol2': formsInputParams.rotationLastLeg.departureStation,
        'flightNumber.vol1': formsInputParams.rotationFirstLeg.company + formsInputParams.rotationFirstLeg.number,
        'flightNumber.vol2': formsInputParams.rotationLastLeg.company + formsInputParams.rotationLastLeg.number,
        'flightinfos.pairing.date': this.datePipe.transform(formsInputParams.rotation.departureDate, this.dateFormat),
        'flightinfos.pairing.name': formsInputParams.rotation.number,
        'remplissage.vol1': '',
        'remplissage.vol2': '',
        'stakeholdersinfos.2.1': formsInputParams.redactor.lastName,
        'stakeholdersinfos.2.2': formsInputParams.redactor.firstName,
        'stakeholdersinfos.2.3': formsInputParams.redactor.matricule,
        'stakeholdersinfos.2.4': this.getSpecialityForEForms(this.sessionService.appContext.onBoardRedactorFunction),
        'typeAvion.vol1': formsInputParams.rotationFirstLeg.aircraftType,
        'typeAvion.vol2': formsInputParams.rotationLastLeg.aircraftType,
        'version.vol1': formsInputParams.rotationFirstLeg.operatingVersion,
        'version.vol2': formsInputParams.rotationLastLeg.operatingVersion
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

  /**
   * Recupére la spécialité à envoyer a Eforms
   * @param speciality Spécialité du PNC
   * @return retourne la spécialitè typée pour eforms
   */
  getSpecialityForEForms(speciality: string) {
    if (speciality == 'CC') {
      return 'C/C';
    }
    if (speciality == 'HOT' || speciality == 'STW') {
      return 'HST';
    }
    return speciality;
  }
}
