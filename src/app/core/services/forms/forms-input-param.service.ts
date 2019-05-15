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
    * Récupère une FormsInputParamsModel à partir d'un matricule et d'une rotation
    * @param matricule le matricule du PNC concerné
    * @param rotation la rotation concernée
    * @return une promesse contenant le FormsInputParamsModel trouvée
    */
  getFormsInputParams(matricule: string, rotation: RotationModel): Promise<FormsInputParamsModel> {
    return this.execFunctionService('getFormsInputParams', matricule, rotation);
  }

}
