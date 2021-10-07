import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SortDirection } from '../../../core/enums/sort-direction-enum';

@Component({
  selector: 'sort-list',
  templateUrl: 'sort-list.component.html',
  styleUrls: ['./sort-list.component.scss']
})
export class SortListComponent implements OnInit {

  @Input() value: string;
  @Input() options: Array<SortOption>;
  @Input() direction: SortDirection;
  @Input() disableSort = false;
  @Output() sortChange = new EventEmitter<SortChange>();

  ngOnInit() {
    this.value = this.options[0].value;
    this.direction = SortDirection.ASC;
  }

  /**
   * Modifie la valeur sélectionnée dans la liste
   * @param newValue la nouvelle valeur choisie
   */
  changeSort(newValue: string) {
    this.value = newValue;
    this.direction = SortDirection.ASC;
    this.sortChange.emit({ value: this.value, direction: this.direction });
  }

  /**
   * Modifie le sens du tri
   * @param newDirection la nouvelle direction choisie
   */
  changeSortDirection(newDirection: SortDirection) {
    this.direction = newDirection;
    this.sortChange.emit({ value: this.value, direction: this.direction });
  }
}

/**
 * Evénement émis lors d'un changement de tri
 */
export interface SortChange {
  value: string;
  direction: SortDirection;
}

/**
 * Objet contenant les paramètres de la liste de tri
 */
export interface SortOption {
  value: string;
  label: string;
}
