import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'edospnc-column-sorter',
  templateUrl: './column-sorter.component.html'
})
export class ColumnSorterComponent implements OnInit {

  @Input() columnName: string;
  @Input() sortColumn: string;
  @Input() sortDirection: string;

  constructor() {
  }

  ngOnInit() {
  }
}
