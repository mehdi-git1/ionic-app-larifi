import { AppConstant } from './../../../app.constant';
import { CongratulationLetterModel } from './../../models/congratulation-letter.model';
import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';
import { EntityEnum } from '../../enums/entity.enum';
import * as moment from 'moment';


@Injectable()
export class OfflineCongratulationLetterService {

  constructor(private storageService: StorageService) {
  }

  /**
   * Récupère les lettres de félicitation reçues d'un PNC à partir du cache
   * @param pncMatricule le matricule du PNC
   * @return une promesse contenant les lettres de félicitation reçues
   */
  getReceivedCongratulationLetters(pncMatricule: string): Promise<CongratulationLetterModel[]> {
    return new Promise((resolve) => {
      const congratulationLetterList = this.storageService.findAll(EntityEnum.CONGRATULATION_LETTER);
      let receivedCongratulationLetters = congratulationLetterList.filter(congratulationLetter => {
        // On filtre les PNC concernés pour voir si le PNC recherché est un destinataire
        const concernedPncs = congratulationLetter.concernedPncs.filter(pnc => {
          return pnc.matricule === pncMatricule;
        });
        return concernedPncs.length > 0;
      });
      // On tri par date de création décroissante
      receivedCongratulationLetters = this.sortCongratulationLettersByCreationDate(receivedCongratulationLetters);
      resolve(receivedCongratulationLetters);
    });
  }

  /**
  * Récupère les lettres de félicitation rédigées par un PNC à partir du cache
  * @param pncMatricule le matricule du PNC
  * @return une promesse contenant les lettres de félicitation rédigées
  */
  getWrittenCongratulationLetters(pncMatricule: string): Promise<CongratulationLetterModel[]> {
    return new Promise((resolve) => {
      const congratulationLetterList = this.storageService.findAll(EntityEnum.CONGRATULATION_LETTER);
      let writtenCongratulationLetters = congratulationLetterList.filter(congratulationLetter => {
        return congratulationLetter.redactor.matricule === pncMatricule;
      });
      // On tri par date de création décroissante
      writtenCongratulationLetters = this.sortCongratulationLettersByCreationDate(writtenCongratulationLetters);
      resolve(writtenCongratulationLetters);
    });
  }

  /**
   * Trie la liste des lettres de félicitations par date de rotation
   * @param congratulationLetters liste de lettres de félicitations
   * @return liste de lettres de félicitations triées
   */
  sortCongratulationLettersByCreationDate(congratulationLetters: CongratulationLetterModel[]): CongratulationLetterModel[] {
    return congratulationLetters.sort((letter1, letter2) =>
      moment(letter1.creationDate, AppConstant.isoDateFormat).isAfter(moment(letter2.creationDate, AppConstant.isoDateFormat)) ? -1 : 1);
  }

  /**
  * Récupère une lettre de félicitation à partir de son id
  * @param id l'id de la lettre
  * @return une promesse contenant la lettre de félicitation trouvée
  */
  getCongratulationLetter(id: number): Promise<CongratulationLetterModel> {
    return this.storageService.findOneAsync(EntityEnum.CONGRATULATION_LETTER, `${id}`);
  }

  /**
   * Supprime le lien entre une lettre de félicitation et un pnc à partir de son id et du matricule
   * Methode non disponible en offLine
   * @param id l'id de la lettre de félicitation
   * @param pncMatricule le matricule du pnc
   * @return une promesse contenant la lettre de félicitation
   */
  delete(id: number, pncMatricule: string): Promise<CongratulationLetterModel> {
    return new Promise((reject) => {
      reject();
    });
  }
}
