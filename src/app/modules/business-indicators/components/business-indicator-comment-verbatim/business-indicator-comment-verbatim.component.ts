import { Component, Input } from '@angular/core';

@Component({
  selector: 'business-indicator-comment-verbatim',
  templateUrl: 'business-indicator-comment-verbatim.component.html',
  styleUrls: ['./business-indicator-comment-verbatim.component.scss']
})

export class BusinessIndicatorCommentVerbatimComponent {

  @Input() verbatim: string;
  @Input() reported = false;

  constructor() {
  }

}
