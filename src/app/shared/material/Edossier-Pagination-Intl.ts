import { TranslateService } from '@ngx-translate/core';
import { MatPaginatorIntl } from '@angular/material';
export class EdossierPaginationIntl extends MatPaginatorIntl {

    itemsPerPageLabel = '';
    ofLabel = '';
    nextPageLabel = '';

    previousPageLabel = '';

    firstPageLabel = '';

    lastPageLabel = '';

    constructor(private translateService: TranslateService) {
        super();
        this.translateLabels();
        this.translateService.onLangChange.subscribe(() => {
            this.translateLabels();
        });

    }
    getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
            return '0' + this.ofLabel + length;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        // If the start index exceeds the list length, do not try and fix the end index to the end.
        const endIndex = startIndex < length ?
            Math.min(startIndex + pageSize, length) :
            startIndex + pageSize;
        return startIndex + 1 + ' - ' + endIndex + ' ' + this.ofLabel + ' ' + length;
    }

    translateLabels() {
        this.itemsPerPageLabel = this.translateService.instant('GLOBAL.PAGINATOR.ITEM_BY_PAGE_LABEL');
        this.ofLabel = this.translateService.instant('GLOBAL.PAGINATOR.OF');
    }
}
