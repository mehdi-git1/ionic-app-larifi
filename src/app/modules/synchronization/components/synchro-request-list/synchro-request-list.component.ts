import { Component, Input } from '@angular/core';

import { SynchroRequestModel } from '../../../../core/models/synchro-request.model';

@Component({
  selector: 'synchro-request-list',
  templateUrl: 'synchro-request-list.component.html',
  styleUrls: ['./synchro-request-list.component.scss']
})
export class SynchroRequestListComponent {

  @Input() synchroRequestList: SynchroRequestModel[];
}
