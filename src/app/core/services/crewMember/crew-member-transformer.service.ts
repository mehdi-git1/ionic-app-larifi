import { Injectable } from '@angular/core';

import { CrewMemberModel } from '../../models/crew-member.model';

@Injectable()
export class CrewMemberTransformerService {

  constructor() {
  }

  toCrewMembers(array: CrewMemberModel[]) {
    const newArray: CrewMemberModel[] = [];
    for (const object of array) {
      newArray.push(this.toCrewMember(object));
    }
    return newArray;
  }

  toCrewMember(object: CrewMemberModel): CrewMemberModel {
    return !object ?
      object :
      new CrewMemberModel().fromJSON(object);
  }

}

