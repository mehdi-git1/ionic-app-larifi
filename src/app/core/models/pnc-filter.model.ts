import { PagePositionEnum } from '../enums/page-position.enum';
import { SortDirection } from '../enums/sort-direction-enum';

export class PncFilterModel {

  // Filtres
  pncMatricule: string;
  division: string;
  sector: string;
  ginq: string;
  speciality: string;
  workRate: number;
  aircraftSkill: string;
  relay: string;
  prioritized: boolean;
  hasAtLeastOnePriorityInProgress: boolean;
  hasNoPriority: boolean;
  hasHiddenEvents: boolean;
  hasDefaultHiddenEvents: boolean;
  priorityCategoryCode: string;
  hasManifex: boolean;
  taf: boolean;
  hasEobsBefore18Months: boolean;
  hasPIOrEPPGreaterThan24Month: boolean;

  // Tri
  sortColumn: string;
  sortDirection: SortDirection;

  // Page
  size: number;
  page: number;
  offset: number;
  pagePosition: PagePositionEnum;

}
