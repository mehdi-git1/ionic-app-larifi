import {
  MyBoardNotificationFilterModel
} from 'src/app/core/models/my-board/my-board-notification-filter.model';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import {
  NotificationDocumentTypeEnum
} from '../../../../core/enums/my-board/notification-document-type.enum';
import { SessionService } from '../../../../core/services/session/session.service';

@Component({
  selector: 'my-board-filters',
  templateUrl: './my-board-filters.component.html',
  styleUrls: ['./my-board-filters.component.scss'],
})
export class MyBoardFiltersComponent implements OnInit {

  @Input() filters: MyBoardNotificationFilterModel;
  @Output() filtersChanged = new EventEmitter<MyBoardNotificationFilterModel>();

  filterForm: FormGroup;

  documentTypes: Set<NotificationDocumentTypeEnum>;

  constructor(
    private sessionService: SessionService,
    private formBuilder: FormBuilder

  ) {
    this.documentTypes = this.sessionService.getActiveUser().appInitData.myBoardInitData.notificationDocumentTypes;

    this.initForm();
  }

  ngOnInit() {
  }

  /**
   * Initialise le formulaire
   */
  initForm() {
    this.filterForm = this.formBuilder.group({
      documentTypes: [''],
    });
  }

  /**
   * Déclenché quand les types de document sont mis à jour
   * @param event l'événement déclenché
   */
  documentTypesChanged(event) {
    this.filters.documentTypes = new Array();
    for (const documentType of event.detail.value) {
      this.filters.documentTypes.push(documentType);
    }
    this.filtersChanged.emit();
  }
}