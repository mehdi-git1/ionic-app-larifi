

import { ElementRef, EventEmitter, Injectable, Output } from '@angular/core';

export class SortGridColumnEvent {
    ionGridElement: ElementRef;
    columnName: string;
    constructor(
        ionGridElement: ElementRef,
        columnName: string
    ) {
        this.ionGridElement = ionGridElement;
        this.columnName = columnName;
    }
}

@Injectable({ providedIn: 'root' })
export class SortService {
    public static SORT_ICON_ID = 'sortIcon';
    ascIcon = this.createSortAscIcon();
    descIcon = this.createSortDescIcon();

    @Output()
    sortColumnEvent = new EventEmitter<SortGridColumnEvent>();

    constructor() {
    }

    sortColumn(ionGridElement: ElementRef, columnName: string) {
        this.sortColumnEvent.emit(new SortGridColumnEvent(ionGridElement, columnName));
    }

    /**
     * Crée un élément icone de tri descendant
     */
    private createSortDescIcon(): HTMLElement {
        return this.createSortIcon(false);
    }

    /**
     * Crée un élément icone de tri ascendant
     */
    private createSortAscIcon(): HTMLElement {
        return this.createSortIcon(true);
    }

    /**
     * Crée un élément icone de tri descendant ou ascendant en fonction du paramère
     * @param ascending true si ascendant, false sinon
     * @return un icone sous forme élément Html
     */
    private createSortIcon(ascending: boolean): HTMLElement {
        const direction = ascending ? 'up' : 'down';
        const child = document.createElement('ion-icon');
        child.setAttribute('id', SortService.SORT_ICON_ID);
        child.setAttribute('color', 'black');
        child.setAttribute('class', 'icon icon-md icon-md-black ion-md-arrow-drop' + direction + ' ng-star-inserted sort-icon');
        child.setAttribute('ng-reflect-md', 'md-arrow-drop' + direction);
        return child;
    }

}
