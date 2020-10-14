import { SortDirection } from './../enums/sort-direction-enum';
import { PagePositionEnum } from './../enums/page-position.enum';

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
    hasAtLeastOnePriorityInProgress: boolean;
    hasNoPriority: boolean;
    hasHiddenEvents: boolean;
    hasDefaultHiddenEvents: boolean;
    priorityCategoryCode: string;
    taf: boolean;
    
    // Tri
    sortColumn: string;
    sortDirection: SortDirection;

    // Page
    size: number;
    page: number;
    offset: number;
    pagePosition: PagePositionEnum;
}
