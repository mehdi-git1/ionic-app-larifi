import { CrewMember } from '../../models/crewMember';
import { Injectable } from '@angular/core';


@Injectable()
export class CrewMemberTransformerProvider {

  constructor() {
  }

  toCrewMembers(array: CrewMember[]) {
    const newArray: CrewMember[] = [];
    for (const object of array) {
      newArray.push(this.toCrewMember(object));
    }
    return newArray;
  }

  toCrewMember(object: CrewMember): CrewMember {
    return !object ?
      object :
      new CrewMember().fromJSON(object);
  }

}

