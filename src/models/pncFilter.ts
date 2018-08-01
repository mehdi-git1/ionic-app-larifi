import { Speciality } from './speciality';

export class PncFilter {
    // Pagination
    page: number;
    size: number;

    // Tri
    sortColumn: string;
    sortDirection: string;

    // Filtres
    pncMatricule: string;
    division: string;
    sector: string;
    ginq: string;
    speciality: string;
    aircraftSkill: string;
    relay: string;

    // Valeur par défaut des filtres
    ALL = 'ALL';

    constructor(page = 0,
                size = 0,
                sortColumn= '',
                sortDirection = '',
                division= 'ALL',
                sector= 'ALL',
                ginq= 'ALL',
                speciality= 'ALL',
                aircraftSkill= 'ALL',
                relay= 'ALL'){
        this.page = page;
        this.size = size;
        this.sortColumn = sortColumn;
        this.sortDirection = sortDirection;
        this.division = division;
        this.sector = sector;
        this.ginq = ginq;
        this.speciality = speciality;
        this.aircraftSkill = aircraftSkill;
        this.relay = relay;
    }
}
