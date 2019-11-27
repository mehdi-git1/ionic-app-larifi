import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'page-generic-message',
  templateUrl: 'generic-message.page.html',
  styleUrls: ['./generic-message.page.scss']
})
export class GenericMessagePage implements OnInit {

  genericMessage: string;

  constructor(
  ) {
  }

  ngOnInit() {
    if (history.state.data) {
      this.genericMessage = history.state.data.message;
    }
  }

}
