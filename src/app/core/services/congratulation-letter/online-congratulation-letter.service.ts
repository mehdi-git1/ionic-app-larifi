import { CongratulationLetterModel } from '../../models/congratulation-letter.model';
import { Injectable } from '@angular/core';
import { UrlConfiguration } from '../../configuration/url.configuration';
import { RestService } from '../../http/rest/rest.base.service';
import { StorageService } from '../../storage/storage.service';
import { EntityEnum } from '../../enums/entity.enum';

@Injectable()
export class OnlineCongratulationLetterService {

  constructor(
    public restService: RestService,
    private config: UrlConfiguration,
    private storageService: StorageService
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

  /**
   * Supprime le lien entre une lettre de félicitation et un pnc à partir de son id et du matricule
   * @param id l'id de la lettre de félicitation
   * @param pncMatricule le matricule du pnc
   */
  delete(id: number, pncMatricule: string) {
    return new Promise((resolve, reject) => {
      this.restService.delete(this.config.getBackEndUrl('deleteCongratulationLetterByIdAndMatricule', [id, pncMatricule])).then(() => {
        // On supprime le lien entre le PNC et la lettre en cache
        const localCongratulationLetter = this.storageService.findOne(EntityEnum.CONGRATULATION_LETTER, `${id}`);

        if (localCongratulationLetter) {
          // On filtre le PNC concernés
          const filteredConcernedPnc = localCongratulationLetter.concernedPncs.filter(pnc => {
            return pnc.matricule != pncMatricule;
          });

          if (filteredConcernedPnc.length == 0) {
            // S'il n'y a plus de pnc concerné, on efface la lettre
            this.storageService.delete(EntityEnum.CONGRATULATION_LETTER, `${id}`);
          }
          else {
            localCongratulationLetter.concernedPncs = filteredConcernedPnc;
            this.storageService.save(EntityEnum.CONGRATULATION_LETTER, localCongratulationLetter, true);
          }
          this.storageService.persistOfflineMap();
        }
        resolve();
      }).catch(() => reject());
    });
  }

  /**
   * Crée une lettre de félicitation
   * @param congratulationLetter la lettre à créer/modifier
   * @return une promesse contenant la lettre créée/modifiée
   */
  createOrUpdate(congratulationLetter: CongratulationLetterModel): Promise<CongratulationLetterModel> {
    return this.restService.post(this.config.getBackEndUrl('congratulationLetters'), congratulationLetter);
  }

}
