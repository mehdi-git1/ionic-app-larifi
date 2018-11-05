import { OfflineProfessionalLevelProvider } from './offline-professional-level';
import { OnlineProfessionalLevelProvider } from './online-professional-level';
import { ConnectivityService } from './../../services/connectivity/connectivity.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseProvider } from '../base/base.provider';
import { ProfessionalLevel } from '../../models/professionalLevel/professional-level';


@Injectable()
export class ProfessionalLevelProvider extends BaseProvider {

  constructor(
    public connectivityService: ConnectivityService,
    private onlineProfessionalLevelProvider: OnlineProfessionalLevelProvider,
    private offlineProfessionalLevelProvider: OfflineProfessionalLevelProvider) {
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
  getProfessionalLevel(matricule: string): Promise<ProfessionalLevel> {
    return this.execFunctionProvider('getProfessionalLevel', matricule);
  }

}
