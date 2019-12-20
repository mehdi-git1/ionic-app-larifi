import {MatPaginatorIntl} from '@angular/material';
export class EdosPncMatPaginatorIntl extends MatPaginatorIntl {
  itemsPerPageLabel = 'Nombre d\'éléments par page : ';
  nextPageLabel     = 'Page suivante';
  previousPageLabel = 'Page précédente';
  firstPageLabel = 'Première page';
  lastPageLabel = 'Dernière page';

  getRangeLabel =  (page, pageSize, length) => {
    if (length === 0 || pageSize === 0) {
      return '0 de ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
  }
}
