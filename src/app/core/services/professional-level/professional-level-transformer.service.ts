import { ProfessionalLevelModel } from '../../models/professional-level/professional-level.model';
import { Injectable } from '@angular/core';

@Injectable()
export class ProfessionalLevelTransformerService {

  constructor() {
  }

  toProfessionalLevel(object: any): ProfessionalLevelModel {
    return !object ?
      null :
      new ProfessionalLevelModel().fromJSON(object);
  }

}
