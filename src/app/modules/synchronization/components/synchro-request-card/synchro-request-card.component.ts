import { Component, Input } from '@angular/core';

import { SynchroStatusEnum } from '../../../../core/enums/synchronization/synchro-status.enum';
import { SynchroRequestModel } from '../../../../core/models/synchro-request.model';
import {
    SynchronizationManagementService
} from '../../../../core/services/synchronization/synchronization-management.service';

@Component({
  selector: 'synchro-request-card',
  templateUrl: 'synchro-request-card.component.html',
  styleUrls: ['./synchro-request-card.component.scss']
})
export class SynchroRequestCardComponent {

  SynchroStatusEnum = SynchroStatusEnum;

  @Input() synchroRequest: SynchroRequestModel;

  constructor(private synchronizationManagementService: SynchronizationManagementService) {

  }

  deleteSynchroRequest() {
    this.synchronizationManagementService.deleteSynchroRequest(this.synchroRequest);
  }

  reinitSynchroRequest() {
    this.synchronizationManagementService.reinitSynchroRequest(this.synchroRequest);
  }
}
