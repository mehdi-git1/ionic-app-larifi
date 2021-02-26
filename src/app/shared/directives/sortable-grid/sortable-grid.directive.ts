import { Subscription } from 'rxjs';

import {
    Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2
} from '@angular/core';

import { SortService } from '../../../core/services/sort/sort.service';

@Directive({
  selector: '[sortableGrid]'
})
export class SortableGridDirective implements OnInit, OnDestroy {

  @Input('sortableGrid') sortableGrid: Array<any>;

  ascending = false;

  sortedColumn: string;

  constructor(
    private sortService: SortService,
    private element: ElementRef,
    private renderer: Renderer2
  ) {
  }

  @Output()
  sorted = new EventEmitter();

  private columnSortedSubscription: Subscription;

  ngOnInit() {
    this.columnSortedSubscription = this.sortService.sortColumnEvent.subscribe(event => {
      // Vérifie si l'on est sur le bon tableau et la bonne colonne, puis effectue le tri
      if (event.ionGridElement === this.element.nativeElement) {
        if (this.sortedColumn === event.columnName) {
          this.ascending = !this.ascending;
        } else {
          this.ascending = false;
        }
        this.sortedColumn = event.columnName;
        this.sortableGrid.sort((event1, event2) => {
          if (this.ascending) {
            return event1[event.columnName] < event2[event.columnName] ? 1 : -1;
          } else {
            return event1[event.columnName] < event2[event.columnName] ? -1 : 1;
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.columnSortedSubscription.unsubscribe();
  }
}
