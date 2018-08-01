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


    constructor(){
        this.page = 0;
        this.size = 0;
        this.sortColumn = '';
        this.sortDirection = '';
        this.division = this.getAllValue();
        this.sector = this.getAllValue();
        this.ginq = this.getAllValue();
        this.speciality = this.getAllValue();
        this.aircraftSkill = this.getAllValue();
        this.relay = this.getAllValue();
    }

    getAllValue(){
        return 'ALL';
    }
}
