import { Injectable } from '@angular/core';

import { ProfessionalLevelModel } from '../../models/professional-level/professional-level.model';

@Injectable({ providedIn: 'root' })
export class ProfessionalLevelTransformerService {

  toProfessionalLevel(object: any): ProfessionalLevelModel {
    return !object ?
      null :
      new ProfessionalLevelModel().fromJSON(object);
  }

}
