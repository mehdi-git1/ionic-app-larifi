import { FormsInputParamsModel } from './../../models/forms-input-params.model';
import { Injectable } from '@angular/core';

import { EntityEnum } from '../../enums/entity.enum';
import { StorageService } from '../../storage/storage.service';
import { SessionService } from '../session/session.service';
import * as moment from 'moment';
import { AppConstant } from '../../../app.constant';
import { RotationModel } from '../../models/rotation.model';
import { RotationTransformerService } from '../rotation/rotation-transformer.service';


@Injectable()
export class OfflineFormsInputParamService {

  constructor(private storageService: StorageService,
    private sessionService: SessionService,
    private rotationTransformerService: RotationTransformerService) {
  }

  /**
    * Récupère une FormsInputParamsModel à partir d'un matricule et d'une rotation
    * @param matricule le matricule du PNC concerné
    * @param rotation la rotation concernée
    * @return une promesse contenant le FormsInputParamsModel trouvée
    */
  getFormsInputParams(matricule: string, rotation: RotationModel): Promise<FormsInputParamsModel> {
    return new Promise(resolve => {
      const formsInputParams = new FormsInputParamsModel();
      const rotationStorageId = this.rotationTransformerService.toRotation(rotation).getStorageId();

      formsInputParams.observedPnc = this.storageService.findOne(EntityEnum.PNC, matricule);
      formsInputParams.redactor = this.storageService.findOne(EntityEnum.PNC, this.sessionService.getActiveUser().matricule);
      formsInputParams.rotation = this.storageService.findOne(EntityEnum.ROTATION, rotationStorageId);

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
