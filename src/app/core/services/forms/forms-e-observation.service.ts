import { EFormsTypeEnum } from './../../enums/e-forms/e-forms-type.enum';
import { FormsInputParamService } from './forms-input-param.service';
import { FormsInputParamsModel } from './../../models/forms-input-params.model';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

import { SessionService } from '../session/session.service';
import { PncService } from '../pnc/pnc.service';
import { RestService } from '../../http/rest/rest.base.service';
import { Config } from '../../../../environments/config';

declare var window: any;

@Injectable()
export class FormsEObservationService {

  constructor(
    private pncProvider: PncService,
    private formsInputParamService: FormsInputParamService,
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

  getFormsInputParams(observedPncMatricule, rotationId: number): Promise<FormsInputParamsModel> {
    return this.formsInputParamService.getFormsInputParams(observedPncMatricule, rotationId);
  }

  /**
   * Appel de l'application Forms avec les bons paramètres
   * @param formsInputParams Paramétres du formulaire à envoyer
   */
  callForms(formsInputParams: FormsInputParamsModel, chosenEFormsType: String) {
    const param = {
      eformsAppId: `${this.config.eformsUrl}`,
      method: '0',
      reportType: chosenEFormsType || this.getReportTypeForEForms(formsInputParams.observedPnc.speciality),
      callbackUrl: `${this.config.eformsCallbackUrl}`,
      callbackActionLabel: `${this.config.eformsCallbackActionLabel}`,
      archiveData: {
        'PNCObserve.fonction': this.getSpecialityForEForms(formsInputParams.observedPnc.speciality),
        'PNCObserve.matricule': formsInputParams.observedPnc.matricule,
        'PNCObserve.nom': formsInputParams.observedPnc.lastName,
        'PNCObserve.prenom': formsInputParams.observedPnc.firstName,
        'date.vol1': this.datePipe.transform(formsInputParams.rotationFirstLeg.departureDate, 'dd/MM/yyyy'),
        'date.vol2': this.datePipe.transform(formsInputParams.rotationLastLeg.departureDate, 'dd/MM/yyyy'),
        'escaleArrivee.vol1': formsInputParams.rotationFirstLeg.arrivalStation,
        'escaleArrivee.vol2': formsInputParams.rotationLastLeg.arrivalStation,
        'escaleDepart.vol1': formsInputParams.rotationFirstLeg.departureStation,
        'escaleDepart.vol2': formsInputParams.rotationLastLeg.departureStation,
        'flightNumber.vol1': formsInputParams.rotationFirstLeg.company + formsInputParams.rotationFirstLeg.number,
        'flightNumber.vol2': formsInputParams.rotationLastLeg.company + formsInputParams.rotationLastLeg.number,
        'flightinfos.pairing.date': this.datePipe.transform(formsInputParams.rotation.departureDate, 'dd/MM/yyyy'),
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

  /**
   * Recupére le type de l'eForm a renvoyer pour la création vie eForms
   * @param speciality Spécialité du PNC
   * @return retourne la spécialitè typée pour eforms
   */
  getReportTypeForEForms(speciality: string) {
    return EFormsTypeEnum.getType(EFormsTypeEnum[speciality]);
  }
}
