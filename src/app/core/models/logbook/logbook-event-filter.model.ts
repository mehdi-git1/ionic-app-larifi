import { LogbookEventStatusEnum } from "../../enums/logbook-event/logbook-event-status-enum";
import { SortDirection } from "../../enums/sort-direction-enum";

export class LogbookEventFilterModel {
  matricule: string;
  categoryId: string;
  status: LogbookEventStatusEnum;
  isLastEvent: boolean;
  groupId: number;
  archived: boolean;
  // sort
  sortColumn: string;
  sortDirection: SortDirection;

  // Pagination
  size: number;
  offset: number;
  page: number;
}
