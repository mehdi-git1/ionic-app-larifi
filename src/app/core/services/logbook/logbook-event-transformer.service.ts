import { LogbookEventModel } from './../../models/logbook/logbook-event.model';
import { ProfessionalInterviewModel } from './../../models/professional-interview/professional-interview.model';
import { Injectable } from '@angular/core';


@Injectable()
export class LogbookEventTransformerService {

  constructor() {
  }

  toLogbookEvents(array: LogbookEventModel[]) {
    const newArray: LogbookEventModel[] = [];
    for (const object of array) {
      newArray.push(this.toLogbookEvent(object));
    }
    return newArray;
  }

  toLogbookEvent(object: LogbookEventModel): LogbookEventModel {
    return !object ?
      object :
      new LogbookEventModel().fromJSON(object);
  }

}
