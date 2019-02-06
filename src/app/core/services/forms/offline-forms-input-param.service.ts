import { FormsInputParamsModel } from './../../models/forms-input-params.model';
import { Injectable } from '@angular/core';

import { EntityEnum } from '../../enums/entity.enum';
import { StorageService } from '../../storage/storage.service';

@Injectable()
export class OfflineFormsInputParamService {

  constructor(private storageService: StorageService) {
  }

  /**
   * Sauvegarde les paramètres d'entrées de l'appel forms, dans le cache
   * @param FormsInputParam les paramètres d'entrées de l'appel forms à sauvegarder
   * @return une promesse contenant les paramètres d'entrées de l'appel forms sauvés
   */
  save(FormsInputParam: FormsInputParamsModel): Promise<FormsInputParamsModel> {
    return this.storageService.saveAsync(EntityEnum.FORMS_INPUT_PARAM, FormsInputParam);
  }

  /**
   * Récupère les paramètres d'entrées de l'appel forms, du cache à partir d'un matricule et le techId de la rotation
   * @param matricule le matricule du PNC concerné
   * @param rotationId le techId de la rotation concernée
   * @return une promesse contenant les paramètres d'entrées de l'appel forms trouvés
   */
  getFormsInputParams(matricule: string, rotationId: number): Promise<FormsInputParamsModel> {
    return this.storageService.findOneAsync(EntityEnum.FORMS_INPUT_PARAM, `${matricule}-${rotationId}`);
  }

}
