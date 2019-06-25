import { LogbookEventModel } from './logbook-event.model';

export class LogbookSavedEvent {
    logbookEvent: LogbookEventModel;

    constructor(
        logbookEvent: LogbookEventModel
    ) {
      this.logbookEvent = logbookEvent;
    }
}
