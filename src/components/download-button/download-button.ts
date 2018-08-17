import { ConnectivityService } from './../../services/connectivity.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';

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
