

export class HrDocumentSearchModel {

    // Pagination
    page: number;
    size: number;
    offset: number;
    // Tri
    sortColumn: string;
    sortDirection: string;

    // Filtre de recherche
    matricule: string;

    constructor(matricule: string, page: number, size: number) {
        this.matricule = matricule;
        this.page = page;
        this.size = size;
    }

}
