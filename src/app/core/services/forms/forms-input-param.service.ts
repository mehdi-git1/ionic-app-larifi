import { OfflineFormsInputParamService } from './offline-forms-input-param.service';
import { OnlineFormsInputParamService } from './online-forms-input-param.service';
import { FormsInputParamsModel } from './../../models/forms-input-params.model';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';

import { ConnectivityService } from '../connectivity/connectivity.service';
import { RotationModel } from '../../models/rotation.model';

@Injectable()
export class FormsInputParamService extends BaseService {

  constructor(
    protected connectivityService: ConnectivityService,
    private onlineFormsInputParamService: OnlineFormsInputParamService,
    private offlineFormsInputParamService: OfflineFormsInputParamService
  ) {
    super(
      connectivityService,
      onlineFormsInputParamService,
      offlineFormsInputParamService
    );
  }

  /**
  * Récupère les filtres personnalisés d'un PNC, en fonction de ses droits et de son affectation (liste des Div, Secteurs, Ginq auxquels il a le droit etc)
  * @param matricule le matricule du PNC dont on souhaite récupérer le FormsInputParamsModel
  * @param rotation la rotation concernée
  * @return les filtres du PNC
  */
  getFormsInputParams(matricule: string, rotation: RotationModel): Promise<FormsInputParamsModel> {
    return this.execFunctionService('getFormsInputParams', matricule, rotation.number, rotation.departureDate);
  }

}
