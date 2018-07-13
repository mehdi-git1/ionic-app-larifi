import { ConnectivityService } from './../../services/connectivity.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the DownloadButtonComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'download-button',
  templateUrl: 'download-button.html'
})
export class DownloadButtonComponent {

  @Input() synchroInProgress: boolean;

  @Output() onDownload: EventEmitter<any> = new EventEmitter();

  constructor(public connectivityService: ConnectivityService) {
  }




  suggestionWasClicked(clickedEntry: any): void {
    this.onDownload.emit([clickedEntry]);
  }

  downloadFunction(evt: Event): void {
    evt.stopPropagation();
    this.onDownload.next();
  }

}
