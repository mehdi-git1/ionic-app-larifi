import { AppConstant } from './../app/app.constant';
import { PncFilter } from './pncFilter';

export class PncSearchCriteria {

    // Pagination
    page: number;
    size: number;
    offset: number;
    // Tri
    sortColumn: string;
    sortDirection: string;

    // Filtre de recherche
    pncMatricule: string;
    division: string;
    sector: string;
    ginq: string;
    speciality: string;
    aircraftSkill: string;
    relay: string;

    constructor(pncFilter: PncFilter, page: number, size: number) {
        let param: string;
        for (param in pncFilter) {
            if (pncFilter[param] === undefined || pncFilter[param] === 'undefined' || pncFilter[param] === '' || pncFilter[param] === AppConstant.ALL) {
                delete this[param];
            } else {
                this[param] = pncFilter[param];
            }
        }
        this.page = page;
        this.size = size;
    }

}
