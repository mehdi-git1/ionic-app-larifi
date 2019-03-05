import { Component, Input } from '@angular/core';

@Component({
  selector: 'eobs-comment',
  templateUrl: 'eobs-comment.component.html'
})
export class EObsCommentComponent {

  @Input() comment: string;

  @Input() workingAxes: string;

  @Input() strongPoints: string;

  @Input() speciality: string;

  @Input() commentDate: Date;

  @Input() firstName: string;

  @Input() lastName: string;

  @Input() title: string;

  constructor() {
  }

 }
