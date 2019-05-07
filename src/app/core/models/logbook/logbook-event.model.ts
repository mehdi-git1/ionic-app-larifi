import { LogbookCategoryEnum } from './logbook-category-enum';

export class LogbookEventModel {
    matricule: string;
    eventDate: Date;
    pncOrigin: boolean;
    important: boolean;
    hidden: boolean;
    category: LogbookCategoryEnum;
    eventTitle: string;
    eventDescription: string;
    contactsList: string[];
}
