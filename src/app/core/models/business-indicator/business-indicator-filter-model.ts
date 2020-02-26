import { BusinessIndicatorSortColumnEnum } from './../../enums/business-indicators/business-indicators-sort-columns-enum';
import { SortDirection } from 'src/app/core/enums/sort-direction-enum';

export class BusinessIndicatorFilterModel {
    matricule: string;
    sortColumn: BusinessIndicatorSortColumnEnum;
    sortDirection: SortDirection;

    // page
    size: number;
    page: number;
    offset: number;
}