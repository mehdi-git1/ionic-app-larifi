import { Injectable } from '@angular/core';

import { AssignmentModel } from '../../models/assignment.model';
import { PncLightModel } from '../../models/pnc-light.model';
import { PncModel } from '../../models/pnc.model';

@Injectable({ providedIn: 'root' })
export class PncTransformerService {

  constructor() {
  }

  toPncs(array: PncModel[]) {
    const newArray: PncModel[] = [];
    for (const object of array) {
      newArray.push(this.toPnc(object));
    }
    return newArray;
  }

  toPnc(object: PncModel): PncModel {
    return !object ?
      object :
      new PncModel().fromJSON(object);
  }

  toPncLight(pnc: PncModel): PncLightModel {
    const pncLight = new PncLightModel();
    pncLight.matricule = pnc.matricule;
    pncLight.firstName = pnc.firstName;
    pncLight.lastName = pnc.lastName;
    pncLight.division = pnc.assignment.division;
    pncLight.sector = pnc.assignment.sector;
    pncLight.ginq = pnc.assignment.ginq;
    return pncLight;
  }

  transformPncLightToPnc(pncLight: PncLightModel): PncModel {
    const pnc = new PncModel();
    pnc.matricule = pnc.matricule;
    pnc.firstName = pnc.firstName;
    pnc.lastName = pnc.lastName;
    pnc.assignment = new AssignmentModel()
    pnc.assignment.division = pnc.assignment.division;
    pnc.assignment.sector = pnc.assignment.sector;
    pnc.assignment.ginq = pnc.assignment.ginq;
    return pnc;
  }
}
