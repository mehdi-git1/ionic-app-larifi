import { AppConstant } from '../../app.constant';
import { PncFilterModel } from './pnc-filter.model';

export class PncSearchCriteriaModel {

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

    constructor(pncFilter: PncFilterModel, page: number, size: number) {
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
