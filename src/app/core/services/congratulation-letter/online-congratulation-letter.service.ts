import { CongratulationLetterModel } from '../../models/congratulation-letter.model';
import { Injectable } from '@angular/core';
import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';

@Injectable()
export class OnlineCongratulationLetterService {

  constructor(
    public restService: RestService,
    private config: UrlConfiguration
  ) { }


  /**
   * Récupère les lettres de félicitation reçues d'un PNC
   * @param pncMatricule le matricule du PNC
   * @return une promesse contenant les lettres de félicitation reçues
   */
  getReceivedCongratulationLetters(pncMatricule: string): Promise<CongratulationLetterModel[]> {
    return this.restService.get(this.config.getBackEndUrl('getReceivedCongratulationLettersByPnc', [pncMatricule]));
  }

  /**
   * Récupère les lettres de félicitation rédigées par un PNC
   * @param pncMatricule le matricule du PNC
   * @return une promesse contenant les lettres de félicitation rédigées
   */
  getWrittenCongratulationLetters(pncMatricule: string): Promise<CongratulationLetterModel[]> {
    return this.restService.get(this.config.getBackEndUrl('getWrittenCongratulationLettersByPnc', [pncMatricule]));
  }

  /**
   * Récupère une lettre de félicitation à partir de son id
   * @param id l'id de la lettre
   * @return une promesse contenant la lettre de félicitation trouvée
   */
  getCongratulationLetter(id: number): Promise<CongratulationLetterModel> {
    return this.restService.get(this.config.getBackEndUrl('getCongratulationLetterById', [id]));
  }

  /**
   * Corrige le destinataire de la lettre de félicitations
   * @param congratulationLetterId identifiant de la lettre de félicitations
   * @param oldMatricule matricule du pnc incorrect
   * @param fixedMatricule matricule du Pnc corrigé
   */
  fixCongratulationLetterRecipient(congratulationLetterId: number, oldMatricule: string, fixedMatricule: string): Promise<CongratulationLetterModel> {
    return this.restService.post(this.config.getBackEndUrl('fixCongratulationLetterRecipient', [congratulationLetterId]), {oldMatricule : oldMatricule, fixedMatricule: fixedMatricule});
  }
}
