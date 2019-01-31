import { OfflineFormsInputParamService } from './offline-forms-input-param.service';
import { OnlineFormsInputParamService } from './online-forms-input-param.service';
import { FormsInputParamsModel } from './../../models/forms-input-params.model';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';

import { ConnectivityService } from '../connectivity/connectivity.service';

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
  * Récupère les infos d'une FormsInputParamsModel
  * @param matricule le matricule du PNC dont on souhaite récupérer l'FormsInputParamsModel
  * @param rotation le techId de rotation concernée
  * @return les informations du PNC
  */
  getFormsInputParams(matricule: string, rotationId: number): Promise<FormsInputParamsModel> {
    return this.execFunctionService('getFormsInputParams', matricule, rotationId);
  }

}
