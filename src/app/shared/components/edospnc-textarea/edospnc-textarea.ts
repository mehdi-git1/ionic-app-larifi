import { Component, Input } from '@angular/core';

@Component({
  selector: 'edospnc-textarea',
  templateUrl: 'edospnc-textarea.html'
})
export class EdospncTextAreaComponent {

  @Input() value: string;

  @Input() editionMode: boolean;

 }
