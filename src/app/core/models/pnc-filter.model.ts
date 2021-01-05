import { PagePositionEnum } from '../enums/page-position.enum';
import { SortDirection } from '../enums/sort-direction-enum';

export class PncFilterModel {

  // Filtres
  pncMatricule: string;
  division: string;
  sector: string;
  ginq: string;
  speciality: string;
  aircraftSkill: string;
  relay: string;
  prioritized: boolean;
  hasAtLeastOneCareerObjectiveInProgress: boolean;
  hasNoCareerObjective: boolean;
  hasHiddenEvents: boolean;
  hasDefaultHiddenEvents: boolean;
  careerObjectiveCategory: string;
  hasProfessionalInterviewOlderThan24Months: boolean;
  hasNoProfessionalInterview: boolean;
  hasManifex: boolean;
  taf: boolean;
  hasEObsOlderThan18Months: boolean;
  hasNoEObs: boolean;
  workRate: number;

  // Tri
  sortColumn: string;
  sortDirection: SortDirection;

  // Page
  size: number;
  page: number;
  offset: number;
  pagePosition: PagePositionEnum;
}
