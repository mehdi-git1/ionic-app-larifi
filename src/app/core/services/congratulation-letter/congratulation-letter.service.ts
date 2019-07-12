import { CongratulationLetterRedactorTypeEnum } from './../../enums/congratulation-letter/congratulation-letter-redactor-type.enum';
import { DatePipe } from '@angular/common';
import { CongratulationLetterFlightModel } from './../../models/congratulation-letter-flight.model';
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
    protected connectivityService: ConnectivityService,
    private datePipe: DatePipe) {
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
    return new Promise(resolve => {
      this.execFunctionService('getReceivedCongratulationLetters', pncMatricule).then(receivedCongratulationLetters => {
        // On écarte les lettres que le PNC a lui même rédigé (cas des lettres collectives)
        receivedCongratulationLetters = receivedCongratulationLetters.filter(congratulationLetter => {
          return congratulationLetter.redactorType !== CongratulationLetterRedactorTypeEnum.PNC || congratulationLetter.redactor.matricule !== pncMatricule;
        });
        resolve(receivedCongratulationLetters);
      });
    });
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

  /**
   * Supprime le lien entre une lettre de félicitation et un pnc à partir de son id et du matricule
   * @param id l'id de la lettre de félicitation
   * @param pncMatricule le matricule du pnc
   */
  delete(id: number, pncMatricule: string) {
    return this.onlineCongratulationLetterService.delete(id, pncMatricule);
  }

  /**
   * Retourne la date du vol, formatée pour l'affichage
   * @param flight le vol dont on souhaite avoir la date formatée
   * @return la date formatée du vol
   */
  getFormatedFlightDate(flight: CongratulationLetterFlightModel): string {
    return this.datePipe.transform(flight.theoricalDate, 'dd/MM/yyyy', 'UTC');
  }

  /**
   * Crée une lettre de félicitation
   * @param congratulationLetter la lettre à créer/modifier
   * @return une promesse contenant la lettre créée/modifiée
   */
  createOrUpdate(congratulationLetter: CongratulationLetterModel): Promise<CongratulationLetterModel> {
    return this.onlineCongratulationLetterService.createOrUpdate(congratulationLetter);
  }


  /**
   * Corrige le destinataire de la lettre de félicitations
   * @param congratulationLetterId identifiant de la lettre de félicitations
   * @param oldMatricule matricule du pnc incorrect
   * @param fixedMatricule matricule du Pnc corrigé
   */
  fixCongratulationLetterRecipient(congratulationLetterId: number, oldMatricule: string, fixedMatricule: string): Promise<CongratulationLetterModel> {
    return this.onlineCongratulationLetterService.fixCongratulationLetterRecipient(congratulationLetterId, oldMatricule, fixedMatricule);
  }
}
