import { BusinessIndicatorSortColumnEnum } from './../../enums/business-indicators/business-indicators-sort-columns-enum';
import { SortDirection } from 'src/app/core/enums/sort-direction-enum';

export class BusinessIndicatorFilterModel {

  matricule: string;
  firstPeriodStartDate: string;
  firstPeriodEndDate: string;
  secondPeriodStartDate: string;
  secondPeriodEndDate: string;

  // sort
  sortColumn: BusinessIndicatorSortColumnEnum;
  sortDirection: SortDirection;


  // page
  size: number;
  page: number;
  offset: number;
}
