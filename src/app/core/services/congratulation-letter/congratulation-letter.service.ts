import { CongratulationLetterModel } from './../../models/congratulation-letter.model';
import { Injectable } from '@angular/core';

import { OnlineCongratulationLetterService } from './online-congratulation-letter.service';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { OfflineCongratulationLetterService } from './offline-congratulation-letter.service';
import { BaseService } from '../base/base.service';

@Injectable()
export class CongratulationLetterService extends BaseService {
  constructor(
    private onlineCongratulationLetterService: OnlineCongratulationLetterService,
    private offlineCongratulationLetterService: OfflineCongratulationLetterService,
    protected connectivityService: ConnectivityService) {
    super(
      connectivityService,
      onlineCongratulationLetterService,
      offlineCongratulationLetterService
    );
  }

  /**
   * Récupère les lettres de félicitation reçues d'un PNC
   * @param pncMatricule le matricule du PNC
   * @return une promesse contenant les lettres de félicitation reçues
   */
  getReceivedCongratulationLetters(pncMatricule: string): Promise<CongratulationLetterModel[]> {
    return this.execFunctionService('getReceivedCongratulationLetters', pncMatricule);
  }

  /**
  * Récupère les lettres de félicitation rédigées par un PNC
  * @param pncMatricule le matricule du PNC
  * @return une promesse contenant les lettres de félicitation rédigées
  */
  getWrittenCongratulationLetters(pncMatricule: string): Promise<CongratulationLetterModel[]> {
    return this.execFunctionService('getWrittenCongratulationLetters', pncMatricule);
  }

  /**
   * Récupère une lettre de félicitation à partir de son id
   * @param id l'id de la lettre
   * @return une promesse contenant la lettre de félicitation trouvée
   */
  getCongratulationLetter(id: number): Promise<CongratulationLetterModel> {
    return this.execFunctionService('getCongratulationLetter', id);
  }



}
