import { FormsInputParamsModel } from './../../models/forms-input-params.model';
import { Injectable } from '@angular/core';

import { EntityEnum } from '../../enums/entity.enum';
import { StorageService } from '../../storage/storage.service';
import { SpecialityEnum } from '../../enums/speciality.enum';
import { SessionService } from '../session/session.service';
import * as moment from 'moment';
import { AppConstant } from '../../../app.constant';


@Injectable()
export class OfflineFormsInputParamService {

  constructor(private storageService: StorageService,
    private sessionService: SessionService) {
  }

  /**
   * Récupère les paramètres d'entrées de l'appel forms, du cache à partir d'un matricule et le techId de la rotation
   * @param matricule le matricule du PNC concerné
   * @param number le numéro de la rotation concernée
   * @param departureDate la date de la rotation concernée
   * @return une promesse contenant les paramètres d'entrées de l'appel forms trouvés
   */
  getFormsInputParams(matricule: string, number: string, departureDate: string): Promise<FormsInputParamsModel> {
    return new Promise(resolve => {
      const formsInputParams = new FormsInputParamsModel();

      formsInputParams.observedPnc = this.storageService.findOne(EntityEnum.PNC, matricule);
      formsInputParams.redactor = this.storageService.findOne(EntityEnum.PNC, this.sessionService.getActiveUser().matricule);
      formsInputParams.rotation = this.storageService.findOne(EntityEnum.ROTATION, `${number}-${departureDate}`);

      const rotationStorageId = number + departureDate;
      const rotationLegs = this.storageService.findAll(EntityEnum.LEG).filter(leg => {
        return rotationStorageId === leg.rotationStorageId;
      }).sort((leg1, leg2) => {
        return moment(leg1.departureDate, AppConstant.isoDateFormat).isBefore(moment(leg2.departureDate, AppConstant.isoDateFormat)) ? -1 : 1;
      });

      formsInputParams.rotationFirstLeg = rotationLegs[0] === undefined ? undefined : rotationLegs[0];
      formsInputParams.rotationLastLeg = rotationLegs[rotationLegs.length - 1] === undefined ? undefined : rotationLegs[rotationLegs.length - 1];

      resolve(formsInputParams);
    });
  }


}
