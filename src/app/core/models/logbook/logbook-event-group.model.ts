import { DateTransform } from './../../../shared/utils/date-transform';
import { AppConstant } from './../../../app.constant';
import { LogbookEventModel } from './logbook-event.model';
import { Serializable } from './../../../shared/utils/serializable';
import * as moment from 'moment';

export class LogbookEventGroupModel extends Serializable {
  groupId: number;
  logbookEvents: LogbookEventModel[];
  expanded = false;

  constructor(groupId: number, logbookEvents: LogbookEventModel[]) {
    super();
    this.groupId = groupId;
    this.logbookEvents = logbookEvents;
  }
}
