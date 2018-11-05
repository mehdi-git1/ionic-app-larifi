import { ProfessionalLevel } from './../../models/professionalLevel/professional-level';
import { Injectable } from '@angular/core';

@Injectable()
export class ProfessionalLevelTransformerProvider {

  constructor() {
  }

  toProfessionalLevel(object: any): ProfessionalLevel {
    return !object ?
      null :
      new ProfessionalLevel().fromJSON(object);
  }

}
