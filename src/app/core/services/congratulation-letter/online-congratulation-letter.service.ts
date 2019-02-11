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

}
