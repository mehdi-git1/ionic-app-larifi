
export class HrDocumentFilterModel {

    // Pagination
    page: number;
    size: number;
    offset: number;
    // Tri
    sortColumn: string;
    sortDirection: string;

    // Filtre de recherche
    matricule: string;
    categoryId: string;
}
