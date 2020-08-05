import {
    MyBoardNotificationFilterModel
} from 'src/app/core/models/my-board/my-board-notification-filter.model';

import { Component, EventEmitter, OnInit, Output } from '@angular/core';



@Component({
  selector: 'my-board-filters',
  templateUrl: './my-board-filters.component.html',
  styleUrls: ['./my-board-filters.component.scss'],
})
export class MyBoardFiltersComponent implements OnInit {

  @Output() filtersChanged = new EventEmitter<MyBoardNotificationFilterModel>();

  constructor() { }

  ngOnInit() {
  }
}