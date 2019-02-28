import { Component, Input } from '@angular/core';
import { SynchroRequestModel } from '../../../../core/models/synchro-request.model';

@Component({
  selector: 'synchro-request-list',
  templateUrl: 'synchro-request-list.component.html'
})
export class SynchroRequestListComponent {

  @Input() synchroRequestList: SynchroRequestModel[];
}
