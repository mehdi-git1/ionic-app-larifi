import { Injectable } from '@angular/core';

import { LogbookEventModel } from '../../models/logbook/logbook-event.model';

@Injectable({ providedIn: 'root' })
export class LogbookEventTransformerService {

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
