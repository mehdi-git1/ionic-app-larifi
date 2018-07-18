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
    speciality: Speciality;
    aircraftSkill: string;
    relay: string;

    // afficher/masquer le filtre
    showFilter: Boolean;
    icone: string;

}