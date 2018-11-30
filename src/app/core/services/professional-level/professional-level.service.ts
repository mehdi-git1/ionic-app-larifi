import { Injectable } from '@angular/core';

import { OfflineProfessionalLevelService } from './offline-professional-level.service';
import { OnlineProfessionalLevelService } from './online-professional-level.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { BaseService } from '../base/base.service';
import { ProfessionalLevelModel } from '../../models/professional-level/professional-level.model';


@Injectable()
export class ProfessionalLevelService extends BaseService {

  constructor(
    public connectivityService: ConnectivityService,
    private onlineProfessionalLevelProvider: OnlineProfessionalLevelService,
    private offlineProfessionalLevelProvider: OfflineProfessionalLevelService) {
    super(
      connectivityService,
      onlineProfessionalLevelProvider,
      offlineProfessionalLevelProvider
    );
  }

  /**
   * Récupère le suivi réglementaire d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer le suivi réglementaire
   * @return le suivi réglementaire du PNC
   */
  getProfessionalLevel(matricule: string): Promise<ProfessionalLevelModel> {
    return this.execFunctionService('getProfessionalLevel', matricule);
  }

}
