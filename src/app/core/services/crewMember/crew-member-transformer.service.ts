import { Injectable } from '@angular/core';

import { CrewMemberEnum } from '../../models/crew-member.enum';

@Injectable()
export class CrewMemberTransformerService {

  constructor() {
  }

  toCrewMembers(array: CrewMemberEnum[]) {
    const newArray: CrewMemberEnum[] = [];
    for (const object of array) {
      newArray.push(this.toCrewMember(object));
    }
    return newArray;
  }

  toCrewMember(object: CrewMemberEnum): CrewMemberEnum {
    return !object ?
      object :
      new CrewMemberEnum().fromJSON(object);
  }

}

